import { t, Selector } from 'testcafe';
import { currLocation, PASS_BASE_URL } from '../commonTest.js';

class SubmissionPolicies {
  constructor() {}

  async verifySelectedPolicy() {
    const currPolicy = Selector('input').withAttribute(
      'data-test-workflow-policies-radio-no-direct-deposit'
    );
    await t.expect(currPolicy.checked).eql(true);
  }

  async verifyJhuPolicy() {
    const jhuRepository = Selector('h3')
      .withAttribute('data-test-policy-title')
      .withText('Johns Hopkins University (JHU) Open Access Policy');
    await t.expect(jhuRepository.exists).ok();
  }

  async clickNextToRepositories() {
    const goToRepositoriesButton = Selector('button').withAttribute(
      'data-test-workflow-policies-next'
    );
    await t.expect(goToRepositoriesButton.exists).ok();
    await t.click(goToRepositoriesButton);
    await t
      .expect(currLocation())
      .eql(`${PASS_BASE_URL}/app/submissions/new/repositories`);
  }
}

export default new SubmissionPolicies();
