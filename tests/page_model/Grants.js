import { t, Selector } from 'testcafe';
import { currLocation, PASS_BASE_URL } from '../commonTest.js';

class Grants {
  constructor() {
    this.grantsHeader = Selector('h1').withText('Your Grants');
  }

  async verify() {
    await t.expect(this.grantsHeader.exists).ok();
  }

  async clickGrantAwardNumber(awardNumber) {
    const awardNumLink = Selector('a').withText(awardNumber);
    await t.expect(awardNumLink.exists).ok();
    await t.click(awardNumLink, { offsetY: 5 });
    await t.expect(currLocation()).contains(`${PASS_BASE_URL}/app/grants/`);
  }
}

export default new Grants();
