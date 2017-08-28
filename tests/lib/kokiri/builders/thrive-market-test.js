const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/thrive-market', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-013e2e3ddf915475',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], [], approvals);

    this.builder = this.config.createBuilder('org-XXX', 'org-013e2e3ddf915475');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'thrivemarket://home?ReferrerURL=aHR0cHM6Ly90aHJpdmVtYXJrZXQuY29tLz91dG1fbWVkaXVtPWFmZmlsaWF0ZSZ1dG1fc291cmNlPWJ1dHRvbiZ1dG1fY2FtcGFpZ249aWJvdHRhJnV0bV9jb250ZW50PWRlZmF1bHQmdXRtX3Rlcm09bmE%253D&utm_source=org-XXX&utm_campaign=button&btn_ref=srctok-XXX',
        browser_link:
          'https://thrivemarket.com?utm_medium=affiliate&utm_content=default&utm_term=na&utm_source=org-XXX&utm_campaign=button&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link:
          'thrivemarket://home?ReferrerURL=aHR0cHM6Ly90aHJpdmVtYXJrZXQuY29tLz91dG1fbWVkaXVtPWFmZmlsaWF0ZSZ1dG1fc291cmNlPWJ1dHRvbiZ1dG1fY2FtcGFpZ249aWJvdHRhJnV0bV9jb250ZW50PWRlZmF1bHQmdXRtX3Rlcm09bmE%253D&utm_source=org-XXX&utm_campaign=button&btn_ref=srctok-XXX',
        browser_link:
          'https://thrivemarket.com?utm_medium=affiliate&utm_content=default&utm_term=na&utm_source=org-XXX&utm_campaign=button&btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for search', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/catalogsearch/result',
            query: { q: 'coconut' },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'thrivemarket://search?ReferrerURL=aHR0cHM6Ly90aHJpdmVtYXJrZXQuY29tLz91dG1fbWVkaXVtPWFmZmlsaWF0ZSZ1dG1fc291cmNlPWJ1dHRvbiZ1dG1fY2FtcGFpZ249aWJvdHRhJnV0bV9jb250ZW50PWRlZmF1bHQmdXRtX3Rlcm09bmE%253D&search_text=coconut&utm_source=org-XXX&utm_campaign=button&btn_ref=srctok-XXX',
          browser_link:
            'https://thrivemarket.com/catalogsearch/result?q=coconut&utm_medium=affiliate&utm_content=default&utm_term=na&utm_source=org-XXX&utm_campaign=button&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for an unsupported path', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/pet-shops-dogs',
            query: { woof: true },
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://thrivemarket.com/pet-shops-dogs?woof=true&utm_medium=affiliate&utm_content=default&utm_term=na&utm_source=org-XXX&utm_campaign=button&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#universalLink', function() {
    it('returns a universal link', function() {
      assert.deepEqual(
        this.builder.universalLink({}, 'ios', 'srctok-XXX'),
        'https://track.bttn.io/thrivemarket?ReferrerURL=aHR0cHM6Ly90aHJpdmVtYXJrZXQuY29tLz91dG1fbWVkaXVtPWFmZmlsaWF0ZSZ1dG1fc291cmNlPWJ1dHRvbiZ1dG1fY2FtcGFpZ249aWJvdHRhJnV0bV9jb250ZW50PWRlZmF1bHQmdXRtX3Rlcm09bmE%253D&utm_source=org-XXX&utm_campaign=button&btn_ref=srctok-XXX'
      );
    });

    it('returns a universal link for static affiliation', function() {
      assert.deepEqual(
        this.builder.universalLink({}),
        'https://track.bttn.io/thrivemarket?ReferrerURL=aHR0cHM6Ly90aHJpdmVtYXJrZXQuY29tLz91dG1fbWVkaXVtPWFmZmlsaWF0ZSZ1dG1fc291cmNlPWJ1dHRvbiZ1dG1fY2FtcGFpZ249aWJvdHRhJnV0bV9jb250ZW50PWRlZmF1bHQmdXRtX3Rlcm09bmE%253D&utm_source=org-XXX&utm_campaign=button&btn_ref=org-XXX'
      );
    });

    it('returns a universal link for product', function() {
      assert.deepEqual(
        this.builder.universalLink(
          {
            pathname: '/dogs',
            query: { woof: 'true', utm_source: 'sean' },
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        'https://track.bttn.io/thrivemarket/dogs?woof=true&utm_source=org-XXX&ReferrerURL=aHR0cHM6Ly90aHJpdmVtYXJrZXQuY29tLz91dG1fbWVkaXVtPWFmZmlsaWF0ZSZ1dG1fc291cmNlPWJ1dHRvbiZ1dG1fY2FtcGFpZ249aWJvdHRhJnV0bV9jb250ZW50PWRlZmF1bHQmdXRtX3Rlcm09bmE%253D&utm_campaign=button&btn_ref=srctok-XXX'
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.thrivemarket.com/pet-shops-dogs?woof=true'
      ),
      {
        pathname: '/pet-shops-dogs',
        query: { woof: 'true' },
        hash: null,
      }
    );

    assert.deepEqual(this.builder.destinationFromUrl(''), {
      pathname: null,
      query: {},
      hash: null,
    });
  });
});
