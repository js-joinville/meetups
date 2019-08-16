const puppeteer = require('puppeteer');
const selectors = {
  login: {
    user: 'input[name="email"]',
    pass: 'input[name="password"]',
    btn: 'button[type="submit"]'
  },
  billetForm: {
    barcode: 'input[name="barcode"]',
    paymentDate: 'input[name="paymentDate"]',
    description: 'input[name="description"]'
  }
}

class Transfeera { 

  async run() { 
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 800
    });
    this._page = page;
    await page.goto(process.env.target);

    await this._login();
    await this._createBillet();

    await browser.close();
  }

  async _login() { 
    const credentials = {
      user: process.env.user,
      pass: process.env.pass
    };

    await this._wait(selectors.login.user);
    await this._wait(selectors.login.pass);
    await this._wait(selectors.login.btn);

    await this._page.type(selectors.login.user, credentials.user);
    await this._page.type(selectors.login.pass, credentials.pass);
    await this._page.click(selectors.login.btn);
  }

  async _createBillet() { 
    const billet = {
      barcode: '23790.50400 41990.815171 50008.109204 1 79850000026000 ',
      paymentDate: '16/08/2019',
      description: 'Meetup JS'
    };


    await this._wait('input[placeholder="Nome do lote ou valor"]');

    await this._page.evaluate(() => document.querySelectorAll('.dropdown')[1].querySelectorAll('a')[2].click());

    await this._wait(selectors.billetForm.barcode);
    await this._wait(selectors.billetForm.paymentDate);
    await this._wait(selectors.billetForm.description);

    await this._page.type(selectors.billetForm.barcode, billet.barcode);
    await this._page.type(selectors.billetForm.paymentDate, billet.paymentDate);
    await this._page.type(selectors.billetForm.description, billet.description);

    await this._page.evaluate(() => document.querySelectorAll('button[type="submit"]')[2].click());

    await this._wait('input[placeholder="Nome do lote"]');    
    await this._page.waitFor(3000);

    await this._page.evaluate(() => document.querySelectorAll('button[type="submit"]')[1].click());

    await this._page.waitFor(3000);

    await this._wait('img[src="assets/img/banks/bb.svg"]');

    await this._page.evaluate(() => document.querySelectorAll('button[type="submit"]')[1].click());

    await this._wait('.modal-content-container');

    await this._page.waitFor(200);

    await this._page.evaluate(() => document.querySelectorAll('.modal-content-container button')[1].click());

    await this._page.waitFor(4000);
  }

  _wait(selector) { 
    return this._page.waitForSelector(selector, {
      visible: true
    });
  }

}

module.exports = Transfeera;