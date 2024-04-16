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
