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
import { Selector, ClientFunction, t } from 'testcafe';
import minimist from 'minimist';
import dashboardPage from './page_model/Dashboard.js';
import submissionsPage from './page_model/Submissions.js';
import submissionDetailsPage from './page_model/SubmissionDetails.js';

export const PASS_BASE_URL = minimist(process.argv.slice(2))['base-url'];
const FILTER_METADATA = minimist(process.argv.slice(2))['fixture-meta'];
export const IS_DEPLOYMENT_TEST =
  FILTER_METADATA && FILTER_METADATA.toLowerCase().includes('deploymenttest');

const LOGIN_URL = `${PASS_BASE_URL}/app/`;

export const USER = {
  NIH_USER: 'nih-user',
  ADMIN_SUBMITTER: 'admin-submitter',
};

export async function login(usr) {
  return IS_DEPLOYMENT_TEST ? loginSsoMs() : loginLocal(usr);
}

async function loginLocal(usr) {
  return t
    .navigateTo(LOGIN_URL)
    .typeText('#username', usr)
    .typeText('#password', 'moo')
    .click('.form-element.form-button');
}

async function loginSsoMs() {
  const user = process.env.DEPLOYMENT_TEST_USER;
  const password = process.env.DEPLOYMENT_TEST_PASSWORD;
  return t
    .navigateTo(LOGIN_URL)
    .typeText('input[type="email"]', user)
    .click('input[type="submit"]')
    .typeText('input[type="password"]', password)
    .click('input[type="submit"]');
}

export async function logout() {
  return await t
    .click('#user-menu-name') // Open the app menu to make logout btn visible
    .click(Selector('#user-menu a').withText('Logout'));
}

export async function verifyJScholarshipDepositStatusIfNeeded(
  submissionTitle,
  depositStatus
) {
  if (IS_DEPLOYMENT_TEST) {
    let depositStatusRetryCounter = 0;
    let depositCompleted = false;
    while (depositStatusRetryCounter < 6) {
      await dashboardPage.clickSubmissions();
      await submissionsPage.clickSubmission(submissionTitle);
      await submissionDetailsPage.verifyTitle(submissionTitle);
      depositCompleted = await submissionDetailsPage.getDepositStatus(
        depositStatus,
        'JScholarship'
      );
      if (depositCompleted) {
        break;
      } else {
        console.log('Waiting to verify JScholarship Deposit Status...');
        depositStatusRetryCounter++;
        await new Promise((r) => setTimeout(r, 10000));
      }
    }
    await t
      .expect(depositCompleted)
      .ok(`JScholarship Deposit Status is not ${depositStatus}`);
    await submissionDetailsPage.verifyJScholarshipManuscriptIdExists();
  }
}

export const currLocation = ClientFunction(() => window.location.href);

// set in milliseconds
export const TIMEOUT_LENGTH = parseInt(process.env.TIMEOUT_LENGTH) || 60000;
