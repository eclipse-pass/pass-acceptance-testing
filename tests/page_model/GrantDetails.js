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
