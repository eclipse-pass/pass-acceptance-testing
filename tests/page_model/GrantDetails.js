import { t, Selector } from 'testcafe';

class GrantDetails {
  constructor() {
    this.grantDetailsHeader = Selector('h1').withText('Grant Details');
  }

  async verify() {
    await t.expect(this.grantDetailsHeader.exists).ok();
  }

  async verifyAwardNumber(awardNumber) {
    const awardNumLi = Selector('li')
      .withAttribute('data-test-grants-detail-award-number')
      .withText('Award Number: ' + awardNumber);
    await t.expect(awardNumLi.exists).ok();
  }
}

export default new GrantDetails();
