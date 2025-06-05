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
import { currLocation, PASS_BASE_URL, TIMEOUT_LENGTH } from '../commonTest.js';

class SubmissionBasic {
  constructor() {
    this.doiInput = Selector('#doi');
    this.titleName = Selector('#title');
    this.journalName = Selector('.form-control').withAttribute(
      'data-test-journal-name-input'
    );
    this.journalSelectTrigger = Selector('div.ember-basic-dropdown-trigger');
    this.journalSelectInput = Selector('input.ember-power-select-search-input');
  }

  async inputDoi(doi) {
    await t.expect(this.doiInput.exists).ok();
    await t.typeText(this.doiInput, doi, { paste: true });
    const toastMessage = Selector('.flash-message', {
      timeout: TIMEOUT_LENGTH,
    }).withText("We've pre-populated information from the DOI provided!");
    await t.expect(toastMessage.exists).ok();
  }

  async inputTitle(title) {
    await t.expect(this.titleName.exists).ok();
    await t.typeText(this.titleName, title, { paste: true });
    await t.expect(this.titleName.value).eql(title);
  }

  async selectJournal(journalName) {
    await t.expect(this.journalSelectTrigger.exists).ok();
    await t.click(this.journalSelectTrigger);
    await t.expect(this.journalSelectInput.exists).ok();
    await t.typeText(this.journalSelectInput, journalName, { paste: true });
    const journalOption = Selector('li.ember-power-select-option', {
      timeout: TIMEOUT_LENGTH,
    }).withText(journalName);
    await t.expect(journalOption.exists).ok();
    await t.click(journalOption);
    const journalSelectedItem = Selector('.ember-power-select-selected-item', {
      timeout: TIMEOUT_LENGTH,
    }).withText(journalName);
    await t.expect(journalSelectedItem.exists).ok();
  }

  async validateTitle(expectedTitle) {
    await t.expect(this.titleName.value).eql(expectedTitle);
  }

  async validateJournal(expectedJournal) {
    const actualJournalName = await this.journalName.value;
    await t
      .expect(actualJournalName.toLowerCase())
      .contains(expectedJournal.toLowerCase());
  }

  async validateJournalIsEmpty() {
    const journalPlaceholder = Selector(
      '.ember-power-select-placeholder'
    ).withText('Journal');
    await t.expect(journalPlaceholder.exists).ok();
  }

  async validateTitleAndJournalReadOnly() {
    const expectedTitle = await this.titleName.value;
    await t.typeText(this.titleName, 'title-change');
    await this.validateTitle(expectedTitle);
    const expectedJournal = await this.journalName.value;
    await t.typeText(this.journalName, 'journal-change');
    await this.validateJournal(expectedJournal);
  }

  async clickNextToGrants() {
    const goToGrantsButton = Selector('button').withAttribute(
      'data-test-workflow-basics-next'
    );
    await t.expect(goToGrantsButton.exists).ok();
    await t.click(goToGrantsButton, { speed: 0.5 });
    await t
      .expect(currLocation())
      .eql(`${PASS_BASE_URL}/app/submissions/new/grants`);
  }
}

export default new SubmissionBasic();
