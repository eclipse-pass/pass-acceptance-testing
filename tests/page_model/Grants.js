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

class Grants {
  constructor() {
    this.grantsHeader = Selector('h1').withText('Your Grants');
  }

  async verify() {
    await t.expect(this.grantsHeader.exists).ok();
  }

  async clickGrantAwardNumber(awardNumber) {
    const awardNumLink = Selector('a').withText(awardNumber);
    await t.expect(awardNumLink.exists).ok();
    await t.click(awardNumLink, { offsetY: 5 });
    await t.expect(currLocation()).contains(`${PASS_BASE_URL}/app/grants/`);
  }
}

export default new Grants();
