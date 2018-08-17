const { pick } = require('lodash');

const { parseUrl, attributeLink } = require('../lib');
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
   * Returns a value for a partner parameter/organization pairing
   *
   * @param  {string} name, name of the parameter
   * @param  {string} fallback, fallback value if no parameter exists
   * @return {string} the value for this name/partner pairing
   */
  getPartnerValue(name, fallback) {
    return this.config.getPartnerValue(
      name,
      this.merchantId,
      this.publisherId,
      fallback
    );
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
   * Returns a properly attributed link.  If the instance class has declared
   * that outgoing links should not have Button attribution applied, simply
   * returns `url`.  This is likely the case with downstream targets that have
   * proprietary attribution semantics (like an affiliate network).  Otherwise,
   * Button attribution will be applied to `url` without mutating any input
   * arguments.
   *
   * @private
   * @param  {string} url
   * @param  {string} attributionToken
   * @return {string} A url, maybe with Button attribution applied.
   */
  attributeLink(url, attributionToken) {
    return this.constructor.HasButtonAffiliation
      ? attributeLink(url, attributionToken)
      : url;
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
      ? this.getAppLink(appDestination, platform, attributionToken, destination)
      : null;

    const browserLink = this.getBrowserLink(destination, attributionToken);

    return {
      app_link: this.attributeLink(appLink, attributionToken),
      browser_link: this.attributeLink(browserLink, attributionToken),
    };
  }

  /**
   * Returns a Boomerang consumable web action.
   *
   * A web action has two fields:
   *
   * {
   *   app_link := A Button universal link, i.e. https://partner.bttn.io/
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
      ? this.getButtonUniversalLink(appDestination, platform, attributionToken)
      : null;

    const browserLink = this.getBrowserLink(destination, attributionToken);

    return {
      app_link: this.attributeLink(appLink, attributionToken),
      browser_link: this.attributeLink(browserLink, attributionToken),
    };
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
   * @param  {Object} destination The original, un-mapped destination object
   * @return {?string}
   */
  // eslint-disable-next-line no-unused-vars
  getAppLink(appDestination, platform, attributionToken, destination) {
    return null;
  }

  /**
   * Returns a browser link (typically used for an embedded webview).
   *
   * All link builders may implement this method.
   *
   * @param  {Object} destination
   * @param  {string} attributionToken
   * @return {?string}
   */
  // eslint-disable-next-line no-unused-vars
  getBrowserLink(destination, attributionToken) {
    return null;
  }

  /**
   * Returns a Button universal link (partner.bttn.io). Only invoked when a
   * valid app destination is known to exist via #mapWebDestinationToUniversal.
   *
   * Returns null if the merchant(s) haven't registered their bttn.io subdomain
   * on the passed platform.
   *
   * All link builders may implement this method.
   *
   * @param  {Object} appDestination The destination in terms of the target app
   *   (i.e. already passed through the #mapWebDestinationToUniversal logic).
   * @param  {string} platform
   * @param  {string} attributionToken
   * @return {?string}
   */
  // eslint-disable-next-line no-unused-vars
  getButtonUniversalLink(appDestination, platform, attributionToken) {
    return null;
  }
}

LinkBuilder.AppMappings = [{ match: true }];
LinkBuilder.UniversalMappings = [{ match: true }];
LinkBuilder.HasButtonAffiliation = true;

module.exports = LinkBuilder;
