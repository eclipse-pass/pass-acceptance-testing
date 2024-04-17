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
import { fixture, test } from 'testcafe';
import { login } from './commonTest';
import dashboardPage from './page_model/Dashboard.js';
import submissionsPage from './page_model/Submissions';
import submissionBasicPage from './page_model/SubmissionBasic';
import grantsPage from './page_model/Grants';
import grantDetailsPage from './page_model/GrantDetails';

fixture`Acceptance Testing: Dashboard Tests`.meta({ deploymentTest: 'true' });

test('can lookup DOI', async () => {
  // Log in
  await login('nih-user');

  await dashboardPage.verify();
  await dashboardPage.clickSubmissions();
  await submissionsPage.startSubmission();

  await submissionBasicPage.inputDoi('10.1039/c7an01256j');
  await submissionBasicPage.validateTitle(
    'Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS'
  );
  await submissionBasicPage.validateJournal('The Analyst');
  await submissionBasicPage.validateTitleAndJournalReadOnly();
}).disablePageCaching;

test('can view Grants page', async () => {
  // Log in
  await login('nih-user');

  await dashboardPage.verify();
  await dashboardPage.clickGrants();
  await grantsPage.verify();
  await grantsPage.clickGrantAwardNumber('TEST_E2E_AWD_NUM');
  await grantDetailsPage.verify();
  await grantDetailsPage.verifyAwardNumber('TEST_E2E_AWD_NUM');
}).disablePageCaching;

test('can view Submissions page', async () => {
  // Log in
  await login('nih-user');

  await dashboardPage.verify();
  await dashboardPage.clickSubmissions();
  await submissionsPage.verifySubmissionsHeader();
}).disablePageCaching;
