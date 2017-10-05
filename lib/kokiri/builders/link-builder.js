const { pick } = require('lodash');

const { parseUrl, formatUrl, attributeLink } = require('../lib');
const { mapDestination } = require('../app-mapping');

/**
 * LinkBuilder
 *
 * This is an abstract base class used to standardize the interface of all
 * LinkBuilder subclasses, which will be merchant-specific classes responsible
 * for handling the specific nuances regarding the construction and
 * interpretation of that merchant's links.
 *
 */
class LinkBuilder {
  constructor(config, publisherId, merchantId) {
    this.config = config;
    this.publisherId = publisherId;
    this.merchantId = merchantId;
  }

  /**
   * Returns a destination object for the given url that is consumable by
   * instances of the same subclass.
   *
   * @param  {string} url
   * @return {Object} Representative destination object.
   */
  destinationFromUrl(url) {
    return this.getDestinationFromUrl(this.config.destinationUrl(url));
  }

  /**
   * Maps a web destination object to platform-specific scheme-based destination
   * object, or null if that destination is not supported by the target
   * platform.
   *
   * @private
   * @param  {Object} destination
   * @param  {string} platform
   * @return {?Object}
   */
  mapWebDestinationToApp(destination, platform) {
    return mapDestination(
      this,
      this.constructor.AppMappings,
      destination,
      platform
    );
  }

  /**
   * Maps a web destination object to platform-specific universal-link-based
   * destination object, or null if that destination is not supported by the
   * target platform.
   *
   * @private
   * @param  {Object} destination
   * @param  {string} platform
   * @return {?Object}
   */
  mapWebDestinationToUniversal(destination, platform) {
    return mapDestination(
      this,
      this.constructor.UniversalMappings,
      destination,
      platform
    );
  }

  /**
   * Returns an SDK consumable app action.
   *
   * An app action has two fields:
   *
   * {
   *   app_link := A direct link to a merchant app, i.e. partner://
   *   browser_link := A web link to a merchant app, i.e. https://partner.com/
   * }
   *
   * This method must not mutate destination.  A ?btn_ref query param will be
   * added to all outgoing links.
   *
   * If the target destination is not well-known in the app namespace, app_link
   * will be null.
   *
   * @param  {Object} destination
   * @param  {string} platform
   * @param  {string} attributionToken
   * @return {Object} An SDK consumable app action
   */
  appAction(destination, platform, attributionToken) {
    const appDestination = this.mapWebDestinationToApp(destination, platform);

    const appLink = appDestination
      ? this.getAppLink(appDestination, platform, attributionToken)
      : null;

    const browserLink = this.getBrowserLink(destination, attributionToken);

    return {
      app_link: attributeLink(appLink, attributionToken),
      browser_link: attributeLink(browserLink, attributionToken),
    };
  }

  /**
   * Returns a Boomerang consumable web action.
   *
   * A web action has two fields:
   *
   * {
   *   app_link := A universal link, i.e. https://partner.bttn.io/
   *   browser_link := A web link, i.e. https://partner.com/
   * }
   *
   * This method must not mutate destination.  A ?btn_ref query param will be
   * added to all outgoing links.
   *
   * If the target destination is not well-known in the app namespace, app_link
   * will be null.
   *
   * @param  {Object} destination
   * @param  {string} platform
   * @param  {string} attributionToken
   * @return {Object} An SDK consumable app action
   */
  webAction(destination, platform, attributionToken) {
    const appDestination = this.mapWebDestinationToUniversal(
      destination,
      platform
    );

    const appLink = appDestination
      ? this.universalLink(appDestination, platform, attributionToken)
      : null;

    const browserLink = this.getBrowserLink(destination, attributionToken);

    return {
      app_link: attributeLink(appLink, attributionToken),
      browser_link: attributeLink(browserLink, attributionToken),
    };
  }

  /**
   * Returns a partner.bttn.io link.
   *
   * @private
   * @param  {Object} appDestination
   * @param  {string} platform
   * @param  {string} attributionToken
   * @return {string}
   */
  universalLink(appDestination, platform, attributionToken) {
    const partnerSubdomain = this.getPartnerSubdomain(appDestination);

    if (!partnerSubdomain) {
      return null;
    }

    const { pathname, query, hash } = this.getUniversalLinkDestination(
      appDestination,
      platform,
      attributionToken
    );

    return formatUrl({
      protocol: 'https',
      hostname: `${partnerSubdomain}.bttn.io`,
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  /**
   * Returns a default browser url to a merchant app,
   * https://www.partner.com/...
   *
   * TODO: enable subdomain and browser domain to be different
   *
   * @param  {Object} destination
   * @return {string} A partner url
   */
  defaultBrowserLink(destination) {
    const { pathname, query, hash } = destination;
    const partnerSubdomain = this.getPartnerSubdomain(destination);

    return formatUrl({
      protocol: 'https',
      hostname: `www.${partnerSubdomain}.com`,
      pathname,
      query,
      hash,
      slashes: true,
    });
  }

  /**
   * Returns a destination object for the given url that is consumable by
   * instances of the same subclass.
   *
   * All link builders may implement this method.  If not defined on the
   * subclass, this default implementation will be invoked.
   *
   * @private
   * @param  {string} url
   * @return {Object} Representative destination object.
   */
  getDestinationFromUrl(url) {
    return pick(parseUrl(url), ['pathname', 'query', 'hash']);
  }

  /**
   * Returns an app link.  Only invoked when a valid app destination is known
   * to exist via #mapWebDestinationToApp.
   *
   * All link builders may implement this method.
   *
   * @param  {Object} appDestination The destination in terms of the target app
   *   (i.e. already passed through the #mapWebDestinationToApp logic).
   * @param  {string} platform
   * @param  {string} attributionToken
   * @return {string}
   */
  // eslint-disable-next-line no-unused-vars
  getAppLink(appDestination, platform, attributionToken) {
    return this.defaultBrowserLink(appDestination);
  }

  /**
   * Returns a browser link (typically used for an embedded webview).
   *
   * All link builders may implement this method.
   *
   * @param  {Object} destination
   * @param  {string} attributionToken
   * @return {string}
   */
  // eslint-disable-next-line no-unused-vars
  getBrowserLink(destination, attributionToken) {
    return this.defaultBrowserLink(destination);
  }

  /**
   * Returns the partner's web-to-app-mapping subdomain to use for creating
   * universal links.
   *
   * The default implementation will look up a bttnio subdomain from available
   * web to app mappings.
   *
   * This method must not mutate destination.
   *
   * @param  {Object} destination
   * @return {?string} the web-to-app-mapping partner subdomain
   */
  // eslint-disable-next-line no-unused-vars
  getPartnerSubdomain(destination) {
    return this.config.bttnioSubdomainFromMerchantId(this.merchantId);
  }

  /**
   * Returns the partner's intended destination with custom affiliation
   * parameters set.
   *
   * All link builders may implement this method.  If not defined on the
   * subclass, this default implementation will be invoked.
   *
   * This method must not mutate destination.
   *
   * @param  {Object}  destination the target destination
   * @param  {string}  platform
   * @param  {string}  attributionToken
   * @return {Object}  an updated destination which includes attribution
   *   parameters.
   */
  // eslint-disable-next-line no-unused-vars
  getUniversalLinkDestination(appDestination, platform, attributionToken) {
    return appDestination;
  }
}

LinkBuilder.AppMappings = [{ match: true }];
LinkBuilder.UniversalMappings = [{ match: true }];

module.exports = LinkBuilder;
