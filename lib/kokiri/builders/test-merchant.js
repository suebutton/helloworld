const { formatUrl } = require('../lib');
const LinkBuilder = require('./link-builder');

/**
 * Button Test Merchant (buttontestmerchant.com)
 *
 * This is a fake merchant we allow our publishers to test with in
 * sandbox mode. It will generate some real-ish looking order data
 * and report it with the source token the user linked in with.
 */
class TestMerchant extends LinkBuilder {
  getBrowserLink(destination) {
    const { pathname, query, hash } = destination;

    // Test merchant is a little special, since it's owned by
    // us and as such as separate environments that we care about.
    if (process.env.NODE_ENV === 'production') {
      return formatUrl({
        protocol: 'https',
        hostname: 'buttontestmerchant.com',
        pathname,
        query,
        hash,
        slashes: true,
      });
    }

    return formatUrl({
      protocol: 'http',
      hostname:
        'lb-test-merchant-ecs-staging-1764591536.us-west-2.elb.amazonaws.com',
      pathname,
      query,
      hash,
      slashes: true,
    });
  }
}

module.exports = TestMerchant;
