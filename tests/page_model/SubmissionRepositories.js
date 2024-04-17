/*
 * Copyright 2024 Johns Hopkins University
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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

  async verifyRequiredRepositoryNotExist(repositoryName) {
    const repositories = Selector('ul')
      .withAttribute('data-test-workflow-repositories-required-list')
      .child('li')
      .withText(repositoryName);
    await t.expect(repositories.exists).notOk();
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
