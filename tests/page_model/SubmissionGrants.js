import { t, Selector } from 'testcafe';
import { currLocation, PASS_BASE_URL } from '../commonTest.js';

class SubmissionGrants {
  constructor() {
    this.goToPoliciesButton = Selector('button').withAttribute(
      'data-test-workflow-grants-next'
    );
  }

  async selectGrant(grant) {
    const nihGrant = Selector('#grants-selection-table a').withText(grant);
    await t
      .expect(nihGrant.exists)
      .ok()
      .click(nihGrant.parent(0).nextSibling(0));

    const submittedGrant = Selector('table')
      .withAttribute('data-test-submission-funding-table')
      .child('tbody')
      .child('tr')
      .child('td')
      .child('a')
      .withText(grant);
    await t.expect(submittedGrant.exists).ok();
  }

  async clickNextToPolicies() {
    await t.expect(this.goToPoliciesButton.exists).ok();
    await t.click(this.goToPoliciesButton);
    await t
      .expect(currLocation())
      .eql(`${PASS_BASE_URL}/app/submissions/new/policies`);
  }
}

export default new SubmissionGrants();
