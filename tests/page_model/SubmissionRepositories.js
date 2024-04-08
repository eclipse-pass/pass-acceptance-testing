import { t, Selector } from 'testcafe';
import { currLocation, PASS_BASE_URL } from '../commonTest.js';

class SubmissionRepositories {
  constructor() {}

  async verifyRequiredRepository(repositoryName) {
    const repositories = Selector('ul')
      .withAttribute('data-test-workflow-repositories-required-list')
      .child('li')
      .withText(repositoryName);
    await t.expect(repositories.exists).ok();
    return repositories;
  }

  async verifyOptionalRepositorySelected(repositoryName) {
    const repositories = Selector('ul')
      .withAttribute('data-test-workflow-repositories-optional-list')
      .child('li')
      .withText(repositoryName);
    await t.expect(repositories.exists).ok();
    await t.expect(repositories.child('input').checked).eql(true);
  }

  async clickNextToMetadata() {
    const goToMetadataButton = Selector('button').withAttribute(
      'data-test-workflow-repositories-next'
    );
    await t.expect(goToMetadataButton.exists).ok();
    await t.click(goToMetadataButton);
    await t
      .expect(currLocation())
      .eql(`${PASS_BASE_URL}/app/submissions/new/metadata`);
  }
}

export default new SubmissionRepositories();
