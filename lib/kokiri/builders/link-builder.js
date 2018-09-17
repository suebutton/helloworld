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
   * Required for PEP-15420: this is an optimally short-term patch to try and
   * mitigate broken app affiliation in the case where the raw merchant domain
   * also supports Universal Linking.  I'd like to consider a more holistic
   * approach to handling this sort-of thing in the future.
   *
   * @private
   * @param  {Object} destination
   * @param  {string} platform
   * @return {?Object}
   */
  mapWebDestinationToWeb(destination, platform) {
    return mapDestination(
      this,
      this.constructor.WebToWebMappings,
      destination,
      platform
    );
  }

  /**
   * Given a link targeting app and a link targeting web, returns a dictionary
   * of each with appropriate affiliation parameters applied.
   *
   * Button affiliation parameters are optionally appended depending on whether
   * we expect a Merchant to affiliate directly with Button on a specific
   * platform.  For instance, Hybrid merchants will affiliate directly with
   * Button in App and through an affiliate network on web.
   *
   * @private
   * @param  {string} appLink
   * @param  {string} browserLink
   * @param  {string} attributionToken
   * @return {Object} A composite value of both links with attribution
   *   parameters applied.
   */
  action(appLink, browserLink, attributionToken) {
    return {
      app_link: attributeLink(
        appLink,
        attributionToken,
        this.constructor.HasButtonAppAffiliation
      ),
      browser_link: attributeLink(
        browserLink,
        attributionToken,
        this.constructor.HasButtonWebAffiliation
      ),
    };
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

    return this.action(appLink, browserLink, attributionToken);
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

    const webDestination = this.mapWebDestinationToWeb(destination, platform);

    const browserLink = webDestination
      ? this.getBrowserLink(webDestination, attributionToken)
      : null;

    return this.action(appLink, browserLink, attributionToken);
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
LinkBuilder.WebToWebMappings = [{ match: true }];
LinkBuilder.HasButtonAppAffiliation = true;
LinkBuilder.HasButtonWebAffiliation = true;

module.exports = LinkBuilder;
