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

class Dashboard {
  constructor() {
    this.manageHeader = Selector('h2').withText(
      'Manage Publication Submissions'
    );
    this.submissionsLink = Selector('.nav-link.ember-view').withText(
      'Submissions'
    );
    this.grantsLink = Selector('.nav-link.ember-view').withText('Grants');
  }

  async verify() {
    await t.expect(this.manageHeader.exists).ok();
  }

  async clickSubmissions() {
    await t.expect(this.submissionsLink.exists).ok();
    await t.click(this.submissionsLink);
    await t.expect(currLocation()).contains(`${PASS_BASE_URL}/app/submissions`);
  }

  async clickGrants() {
    await t.expect(this.grantsLink.exists).ok();
    await t.click(this.grantsLink);
    await t.expect(currLocation()).eql(`${PASS_BASE_URL}/app/grants`);
  }
}

export default new Dashboard();
