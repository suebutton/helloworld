const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const EBAY_ORG_ID = 'org-5d63b849c1d24db2';
const SHOPKICK_ORG_ID = 'org-030575eddb72b4df';
const IBOTTA_ORG_ID = 'org-2d432a88b9bb8bda';

describe('lib/kokiri/builders/ebay', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: EBAY_ORG_ID,
      },
      {
        status: 'approved',
        audience: SHOPKICK_ORG_ID,
        organization: EBAY_ORG_ID,
      },
      {
        status: 'approved',
        audience: IBOTTA_ORG_ID,
        organization: EBAY_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        default_value: '5575211063',
        name: 'pub',
        organization: EBAY_ORG_ID,
      },
      {
        id: '54321',
        default_value: '5337936547',
        name: 'campid',
        organization: EBAY_ORG_ID,
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        value: '5575309782',
        organization: SHOPKICK_ORG_ID,
      },
      {
        partner_parameter: '54321',
        value: '5338106664',
        organization: SHOPKICK_ORG_ID,
      },
      {
        partner_parameter: '12345',
        value: '5575211063',
        organization: IBOTTA_ORG_ID,
      },
      {
        partner_parameter: '54321',
        value: '5337936547',
        organization: IBOTTA_ORG_ID,
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', EBAY_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.ebay.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=home&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with no www', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://ebay.co.uk',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=home&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F710-53481-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Febay.co.uk&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/710-53481-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Febay.co.uk&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with a non-.com TLD not in our allowable list', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.ebay.usa',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=home&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with no www', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://ebay.co.uk',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=home&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F710-53481-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Febay.co.uk&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/710-53481-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Febay.co.uk&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with non-.com TLD', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.ebay.co.uk',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=home&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F710-53481-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.co.uk&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/710-53481-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.co.uk&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for m.ebay.com links', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://m.ebay.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=home&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for m.ebay.co.uk links', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://m.ebay.co.uk',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=home&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F710-53481-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.co.uk&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/710-53481-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.co.uk&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action overriding affiliation parameters', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.ebay.com?ff3=pavel&toolid=pavel&pub=pavel&campid=pavel&customid=pavel',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=home&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(SHOPKICK_ORG_ID, EBAY_ORG_ID);
      assert.deepEqual(
        builder.appActionFromUrl('https://www.ebay.com', 'ios', 'srctok-XXX'),
        {
          app_link:
            'ebay://link?nav=home&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575309782%26campid%3D5338106664%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575309782&campid=5338106664&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for Ibotta when Campaign ID is passed in the incoming URL', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, EBAY_ORG_ID);
      assert.deepEqual(
        builder.appActionFromUrl(
          'https://www.ebay.com?campid=5338414862',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=home&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5338414862%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5338414862&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with Ibotta default Par Par value when Campaign ID is not passed in the incoming URL', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, EBAY_ORG_ID);
      assert.deepEqual(
        builder.appActionFromUrl('https://www.ebay.com', 'ios', 'srctok-XXX'),
        {
          app_link:
            'ebay://link?nav=home&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with Ibotta default Par Par value when Campaign ID passed, but with a non-whitelisted value in the incoming URL', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, EBAY_ORG_ID);
      assert.deepEqual(
        builder.appActionFromUrl(
          'https://www.ebay.com?campid=987',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=home&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with Ibotta default Par Par value when non-Campaign ID key is passed in the incoming URL', function() {
      const builder = this.config.createBuilder(IBOTTA_ORG_ID, EBAY_ORG_ID);
      assert.deepEqual(
        builder.appActionFromUrl(
          'https://www.ebay.com?pub=pavel',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=home&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action without pass through Campaign ID value for publisher not in whitelist', function() {
      const builder = this.config.createBuilder(SHOPKICK_ORG_ID, EBAY_ORG_ID);
      assert.deepEqual(
        builder.appActionFromUrl(
          'https://www.ebay.com?campid=5338414862',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=home&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575309782%26campid%3D5338106664%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575309782&campid=5338106664&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for product pages', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.ebay.com/ctg/Secura-DuxTop-Black-Electric-Induction-Cooktop-/140654293?_pcatid=57',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=item.product&epid=140654293&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com%252Fctg%252FSecura-DuxTop-Black-Electric-Induction-Cooktop-%252F140654293%253F_pcatid%253D57&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com%2Fctg%2FSecura-DuxTop-Black-Electric-Induction-Cooktop-%2F140654293%3F_pcatid%3D57&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.ebay.com/ctg/140654293?_pcatid=57',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=item.product&epid=140654293&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com%252Fctg%252F140654293%253F_pcatid%253D57&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com%2Fctg%2F140654293%3F_pcatid%3D57&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for item pages', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.ebay.com/itm/Apple-iPhone-7-128GB-PRODUCT-RED-Special-Edition-USA-Model-WARRANTY-BRAND-NEW-/152522506551',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=item.view&id=152522506551&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com%252Fitm%252FApple-iPhone-7-128GB-PRODUCT-RED-Special-Edition-USA-Model-WARRANTY-BRAND-NEW-%252F152522506551&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com%2Fitm%2FApple-iPhone-7-128GB-PRODUCT-RED-Special-Edition-USA-Model-WARRANTY-BRAND-NEW-%2F152522506551&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.ebay.com/itm/152522506551',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=item.view&id=152522506551&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com%252Fitm%252F152522506551&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com%2Fitm%2F152522506551&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns homepage app action for non product, non item links', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.ebay.com/rpp/computers-networking',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=home&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com%252Frpp%252Fcomputers-networking&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com%2Frpp%2Fcomputers-networking&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for category pages', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.ebay.com/b/Computers-Tablets-Network-Hardware/58058/bn_1865247',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=item.browse&categoryId=58058&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com%252Fb%252FComputers-Tablets-Network-Hardware%252F58058%252Fbn_1865247&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com%2Fb%2FComputers-Tablets-Network-Hardware%2F58058%2Fbn_1865247&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for event pages', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.ebay.com/rpp/sporting-goods-events/Save-on-Cycling',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=item.events&eventname=Save-on-Cycling&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com%252Frpp%252Fsporting-goods-events%252FSave-on-Cycling&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com%2Frpp%2Fsporting-goods-events%2FSave-on-Cycling&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for category pages without category id', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.ebay.com/b/Collectibles-Art/bn_7000259855',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=item.query&keywords=Collectibles%2BArt&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com%252Fb%252FCollectibles-Art%252Fbn_7000259855&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com%2Fb%2FCollectibles-Art%2Fbn_7000259855&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.ebay.com/b/Collectibles-Art-Marvel/bn_7000259855',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'ebay://link?nav=item.query&keywords=Collectibles%2BArt%2BMarvel&referrer=https%3A%2F%2Frover.ebay.com%2Frover%2F1%2F711-53200-19255-0%2F1%3Fff3%3D4%26toolid%3D11800%26pub%3D5575211063%26campid%3D5337936547%26customid%3Dsrctok-XXX%26mpre%3Dhttp%253A%252F%252Fwww.ebay.com%252Fb%252FCollectibles-Art-Marvel%252Fbn_7000259855&btn_ref=srctok-XXX',
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com%2Fb%2FCollectibles-Art-Marvel%2Fbn_7000259855&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://www.ebay.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with non-.com TLD', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://www.ebay.co.uk',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://rover.ebay.com/rover/1/710-53481-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.co.uk&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with no www', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://ebay.co.uk',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://rover.ebay.com/rover/1/710-53481-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Febay.co.uk&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with destination', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://www.ebay.com/bloop?a=2',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com%2Fbloop%3Fa%3D2&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with affiliation parameters protected', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://www.ebay.com?ff3=pavel&toolid=pavel&pub=pavel&campid=pavel&customid=pavel',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com&btn_ref=srctok-XXX',
        }
      );
    });
  });

  it('returns a destination from a url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://ebay.com/1/2?q=2&mpre=http%3A%2F%2Fwww.ebay.com#anchor'
      ),
      {
        url: 'https://ebay.com/1/2?q=2&mpre=http%3A%2F%2Fwww.ebay.com#anchor',
        hostname: 'ebay.com',
        pathname: '/1/2',
        query: { q: '2', mpre: 'http://www.ebay.com' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://www.ebay.co.uk/1/2?q=2&mpre=http%3A%2F%2Fwww.ebay.com#anchor'
      ),
      {
        url:
          'https://www.ebay.co.uk/1/2?q=2&mpre=http%3A%2F%2Fwww.ebay.com#anchor',
        hostname: 'www.ebay.co.uk',
        pathname: '/1/2',
        query: { q: '2', mpre: 'http://www.ebay.com' },
        hash: '#anchor',
      }
    );
  });

  it('returns a destination from a tracking url', function() {
    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.com%2F1%2F2%3Fq%3D2%23anchor'
      ),
      {
        url: 'http://www.ebay.com/1/2?q=2#anchor',
        hostname: 'www.ebay.com',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX'
      ),
      {
        url: 'https://ebay.com',
        hostname: 'ebay.com',
        pathname: '/',
        query: {},
        hash: null,
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=http%3A%2F%2Fwww.ebay.co.uk%2F1%2F2%3Fq%3D2%23anchor'
      ),
      {
        url: 'http://www.ebay.co.uk/1/2?q=2#anchor',
        hostname: 'www.ebay.co.uk',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(
      this.builder.destinationFromUrl(
        'https://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&toolid=11800&pub=5575211063&campid=5337936547&customid=srctok-XXX&mpre=www.ebay.co.uk%2F1%2F2%3Fq%3D2%23anchor'
      ),
      {
        url: 'https://www.ebay.co.uk/1/2?q=2#anchor',
        hostname: 'www.ebay.co.uk',
        pathname: '/1/2',
        query: { q: '2' },
        hash: '#anchor',
      }
    );

    assert.deepEqual(this.builder.destinationFromUrl(''), {
      url: '',
      hostname: null,
      pathname: null,
      query: {},
      hash: null,
    });
  });
});
