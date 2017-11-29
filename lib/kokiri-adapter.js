const { extend } = require('lodash');

const { parse } = require('url');

const KokiriConfig = require('./kokiri/kokiri-config');
const {
  SUPPORTED_MERCHANTS,
  SUPPORTED_AFFILIATE_QUERY_IDS,
  SUPPORTED_AFFILIATE_PATHNAME_IDS,
  SUPPORTED_AFFILIATES,
} = require('./kokiri/config');

const EXAMPLE_LINKS = require('./kokiri/example-links-config');

const { KokiriError } = require('./kokiri/errors');

const { redirect } = require('./redirect');

const APP_ACTION_TYPE = 'app-action';
const WEB_ACTION_TYPE = 'web-action';

/**
 * KokiriAdapter servers as the interface between Kokiri the module and
 * Kokiri the service.  It provides handy methods and invokes necessary side
 * effects relevant to the service (like metrics logging and bigquery inserts).
 */
class KokiriAdapter {
  /**
   * @param  {libbtn.Metrics} metrics
   * @param  {ClientStore} clientStore
   * @param  {libbtn.BigqueryLogger} bigqueryLogger
   * @param  {libbtn.ErrorLogger } errorLogger
   */
  constructor(metrics, clientStore, bigqueryLogger, errorLogger) {
    this.metrics = metrics;
    this.clientStore = clientStore;
    this.bigqueryLogger = bigqueryLogger;
    this.errorLogger = errorLogger;
  }

  static getAppAction(
    kokiriConfig,
    publisherId,
    url,
    platform,
    attributionToken
  ) {
    const builder = kokiriConfig.createBuilderByUrl(publisherId, url);
    return builder.appAction(
      builder.destinationFromUrl(url),
      platform,
      attributionToken
    );
  }

  /**
   * @private
   * @return {Object[]} A flat array of approvals
   */
  approvals() {
    return [...this.clientStore.approvals.values()];
  }

  /**
   * @private
   * @return {Object[]} A flat array of web-to-app-mappings
   */
  webToAppMappings() {
    return [...this.clientStore.webToAppMappings.values()];
  }

  /**
   * @private
   * @return {Object[]} A flat array of partner parameters
   */
  partnerParameters() {
    return [...this.clientStore.partnerParameters.values()];
  }

  /**
   * @private
   * @return {Object[]} A flat array of partner values
   */
  partnerValues() {
    return [...this.clientStore.partnerValues.values()];
  }

  /**
   * @private
   * @return {KokiriConfig} The config object
   */
  kokiriConfig() {
    return new KokiriConfig(
      SUPPORTED_MERCHANTS,
      SUPPORTED_AFFILIATE_QUERY_IDS,
      SUPPORTED_AFFILIATE_PATHNAME_IDS,
      SUPPORTED_AFFILIATES,
      {
        webToAppMappings: this.webToAppMappings(),
        approvals: this.approvals(),
        partnerParameters: this.partnerParameters(),
        partnerValues: this.partnerValues(),
        onWarning: e => {
          this.errorLogger.logError(e);
        },
      }
    );
  }

  /**
   * @private
   */
  logEnhancementToBigquery(record, extra) {
    if (!this.bigqueryLogger) {
      return;
    }

    this.bigqueryLogger.scheduleInsert(
      'kokiri',
      extend({}, record, extra),
      false
    );
  }

  /**
   * @param  {Koa.Context} ctx
   * @param  {string} publisherId
   * @param  {string} url
   * @return {Object}
   */
  bigqueryRecord(ctx, publisherId, url) {
    return {
      reqid: ctx.state.requestId,
      date: new Date(),
      http_method: ctx.request.method,
      path: parse(ctx.request.url).pathname,
      publisher_organization_id: publisherId,
      merchant_organization_id: null,
      url,
      is_supported: false,
      is_approved: true,
      experience: null,
      universal_link: null,
      app_action: null,
      web_action: null,
    };
  }

  /**
   * @private
   */
  incrementEnhanceLink(status, type, publisher, merchant) {
    this.metrics.increment({
      name: 'kokiri_enhance_link',
      status,
      type,
      publisher,
      merchant,
      statsdName: `kokiri.${status}`,
    });
  }

  /**
   * @private
   */
  incrementRedirect(status) {
    this.metrics.increment({
      name: 'kokiri_redirect',
      status,
    });
  }

  /**
   * @private
   */
  onSuccess(type, publisher, merchant) {
    this.incrementEnhanceLink('success', type, publisher, merchant);
  }

  /**
   * @private
   */
  onError(type, publisher, merchant, e, ctx) {
    this.incrementEnhanceLink('error', type, publisher, merchant);

    if (!(e instanceof KokiriError)) {
      this.errorLogger.logError(e, ctx.request);
    }
  }

  /**
   * Potentially redirects a url, using redis as a cache.
   *
   * @param  {Redis} redis A redis instance
   * @param  {string} url
   * @return {Promise}
   */
  async maybeRedirect(redis, url) {
    const { shouldRedirect, cacheKey, affiliate } = this.redirectAttributes(
      url
    );

    let targetUrl = url;
    if (shouldRedirect) {
      try {
        targetUrl = await redirect(redis, cacheKey, url);
      } catch (e) {
        targetUrl = null;
      }

      this.incrementRedirect(targetUrl === null ? 'failure' : 'success');
    }

    return { targetUrl, shouldRedirect, affiliate };
  }

  /**
   * Returns attributes of a link pertaining to any affiliate networks or
   * redirection:
   *
   *   * shouldRedirect: If the url should be redirected
   *   * cacheKey: A cache key to use for the url
   *   * approved: Whether or not the publisher is approved with that merchant.
   *
   * @param  {string} url The url in question
   * @return {Object} The attributes
   */
  redirectAttributes(url) {
    const kokiriConfig = this.kokiriConfig();

    const shouldRedirect = kokiriConfig.shouldRedirectByUrl(url);
    const cacheKey = kokiriConfig.redirectCacheKey(url);
    const affiliate = kokiriConfig.supportedAffiliateByUrl(url);

    return { shouldRedirect, cacheKey, affiliate };
  }

  /**
   * Returns attributes of a link:
   *
   *   * merchantId: The merchant id
   *   * approved: Whether or not the publisher is approved with that merchant.
   *
   * @param  {string} url The url in question
   * @param  {string} publisherId The requesting Publisher id
   * @return {Object} The attributes
   */
  linkAttributes(url, publisherId) {
    const kokiriConfig = this.kokiriConfig();

    const merchantId = kokiriConfig.merchantIdByUrl(url);
    const approved = kokiriConfig.isApproved(publisherId, merchantId);

    return { merchantId, approved };
  }

  /**
   * Returns a support matrix for the link:
   *
   *   * appToWeb
   *   * appToApp
   *   * webToWeb
   *   * webToApp
   *   * webToAppWithInstall
   *
   * @param  {string} url The url in question
   * @param  {string} publisherId The requesting Publisher id
   * @param  {string} platform "ios" or "android"
   * @return {Object} The support matrix
   */
  supportMatrix(url, publisherId, platform) {
    const kokiriConfig = this.kokiriConfig();

    let appToWeb = false;
    let appToApp = false;
    let webToWeb = false;
    const webToApp = false;
    const webToAppWithInstall = false;

    let appAction;
    try {
      appAction = KokiriAdapter.getAppAction(
        kokiriConfig,
        publisherId,
        url,
        platform,
        'srctok-XXX'
      );
    } catch (e) {
      appAction = null;
    }

    appToApp = !!(appAction && appAction.app_link);
    appToWeb = !!(appAction && appAction.browser_link);
    webToWeb = appToWeb;

    return {
      appToWeb,
      appToApp,
      webToWeb,
      webToApp,
      webToAppWithInstall,
    };
  }

  /**
   * Builds the publisher-specific configuration DSL shipped to the SDK with
   * a new session so it can determine support for link building without making
   * a network request.  The returned object is filtered for approvals.
   *
   * @private
   * @param  {string} publisherId the requesting Publisher Organization id
   * @return {Object} A native object representing the supported merchant links
   *   that can be enhanced.
   */
  sdkConfig(publisherId) {
    const kokiriConfig = this.kokiriConfig();
    return kokiriConfig.toSDKConfig(publisherId);
  }

  /**
   * @param  {string} url The url to enhance
   * @param  {string} publisherId The requesting Publisher id
   * @param  {string} platform "ios" or "android"
   * @param  {string} attributionToken The attribution token
   * @param  {Object} ctx The koa ctx object
   * @param  {string} originalUrl The incoming url, for logging
   * @return {?Object<string, string>} An SDK consumable app action, or
   *   null if unsuccessful.
   */
  appAction(url, publisherId, platform, attributionToken, ctx, originalUrl) {
    if (!url || !publisherId || !platform || !attributionToken || !ctx) {
      return null;
    }

    let merchantId;
    let appAction;

    const inputUrl = originalUrl || url;
    const enhancementRecord = this.bigqueryRecord(ctx, publisherId, inputUrl);

    try {
      const kokiriConfig = this.kokiriConfig();

      merchantId = kokiriConfig.merchantIdByUrl(url);

      appAction = KokiriAdapter.getAppAction(
        kokiriConfig,
        publisherId,
        url,
        platform,
        attributionToken
      );

      this.onSuccess(APP_ACTION_TYPE, publisherId, merchantId);
      return appAction;
    } catch (e) {
      this.onError(APP_ACTION_TYPE, publisherId, merchantId, e, ctx);
      return null;
    } finally {
      this.logEnhancementToBigquery(enhancementRecord, {
        app_action: JSON.stringify(appAction),
        merchant_organization_id: merchantId,
        is_supported: !!merchantId,
      });
    }
  }

  /**
   * @param  {string} url The url to enhance
   * @param  {string} publisherId The requesting Publisher id
   * @param  {string} platform "ios" or "android"
   * @param  {string} attributionToken The attribution token
   * @param  {Object} ctx The koa ctx object
   * @param  {string} originalUrl The incoming url, for logging
   * @return {?Object<string, string>} A web action, or null if unsuccessful.
   */
  webAction(url, publisherId, platform, attributionToken, ctx, originalUrl) {
    if (!url || !publisherId || !platform || !attributionToken || !ctx) {
      return null;
    }

    let merchantId;
    let webAction;

    const inputUrl = originalUrl || url;
    const enhancementRecord = this.bigqueryRecord(ctx, publisherId, inputUrl);

    try {
      const kokiriConfig = this.kokiriConfig();

      merchantId = kokiriConfig.merchantIdByUrl(url);

      const builder = kokiriConfig.createBuilderByUrl(publisherId, url);
      webAction = builder.webAction(
        builder.destinationFromUrl(url),
        platform,
        attributionToken
      );

      this.onSuccess(WEB_ACTION_TYPE, publisherId, merchantId);
      return webAction;
    } catch (e) {
      this.onError(WEB_ACTION_TYPE, publisherId, merchantId, e, ctx);
      return null;
    } finally {
      this.logEnhancementToBigquery(enhancementRecord, {
        web_action: JSON.stringify(webAction),
        merchant_organization_id: merchantId,
        is_supported: !!merchantId,
      });
    }
  }

  /**
   * Retrieves example links for a merchant
   * @param  {string} merchantId
   * @return {Array} An array of example links from config
   */
  exampleLinks(merchantId) {
    const examples = EXAMPLE_LINKS.filter(example => {
      return example.merchant_id === merchantId;
    });
    return examples;
  }

  /**
   * Returns the app linking capabilities for a merchant/platform/url
   * @param  {string} platform, ios or android
   * @param  {string} merchantId
   * @param  {string} url
   * @return {Object}, An object with linking support booleans inside
   */
  appLinkingSupport(platform, merchantId, url) {
    const supportedPlatforms = new Set(['ios', 'android']);
    if (!supportedPlatforms.has(platform)) {
      throw new Error(`Invalid platform ${platform}`);
    }
    const kokiriConfig = this.kokiriConfig();
    const builder = kokiriConfig.createMockBuilder(merchantId);
    const appAction = builder.appAction(
      builder.destinationFromUrl(url),
      platform
    );

    return {
      web_to_app: false,
      app_to_app: !!(appAction && appAction.app_link),
    };
  }
}

module.exports = KokiriAdapter;
