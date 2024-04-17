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

class SubmissionMetadata {
  constructor() {}

  async verifyArticleTitle(expectedArticleTitle) {
    const articleTitle = Selector('textarea').withAttribute('name', 'title');
    await t.expect(articleTitle.value).eql(expectedArticleTitle);
  }

  async verifyJournalTitle(expectedJournalTitle) {
    const journalTitle = Selector('input').withAttribute(
      'name',
      'journal-title'
    );
    await t.expect(journalTitle.value).eql(expectedJournalTitle);
  }

  async inputAuthor(authorName) {
    const authorInput = Selector('input').withAttribute(
      'name',
      'authors_0_author'
    );
    await t
      .expect(authorInput.exists)
      .ok()
      .typeText(authorInput, authorName, { paste: true, speed: 0.75 });
  }

  async clickNextToFiles() {
    const goToFilesButton = Selector('.alpaca-form-button-Next');
    await t.expect(goToFilesButton.exists).ok();
    await t.click(goToFilesButton);
    await t
      .expect(currLocation())
      .eql(`${PASS_BASE_URL}/app/submissions/new/files`);
  }
}

export default new SubmissionMetadata();
