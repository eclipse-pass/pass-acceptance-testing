import { t, Selector } from 'testcafe';
import { currLocation, PASS_BASE_URL } from '../commonTest.js';

class Dashboard {
  constructor() {
    this.manageHeader = Selector('h2').withText(
      'Manage Publication Submissions'
    );
    this.submissionsLink = Selector('.nav-link.ember-view').withText(
      'Submissions'
    );
  }

  async verify() {
    await t.expect(this.manageHeader.exists).ok();
  }

  async clickSubmissions() {
    await t.expect(this.submissionsLink.exists).ok();
    await t.click(this.submissionsLink);
    await t.expect(currLocation()).eql(`${PASS_BASE_URL}/app/submissions`);
  }
}

export default new Dashboard();
