import { fixture, test } from 'testcafe';
import { login } from './commonTest';
import submissionsPage from './page_model/Submissions';
import submissionBasicPage from './page_model/SubmissionBasic';
import submissionGrantsPage from './page_model/SubmissionGrants';
import submissionPoliciesPage from './page_model/SubmissionPolicies';
import submissionRepositoriesPage from './page_model/SubmissionRepositories';
import submissionMetadataPage from './page_model/SubmissionMetadata';
import submissionFilesPage from './page_model/SubmissionFiles';
import submissionReviewPage from './page_model/SubmissionReview';
import submissionSubmitDialogPage from './page_model/SubmissionSubmitDialog';
import submissionThankYouPage from './page_model/SubmissionThankYou';
import submissionDetailsPage from './page_model/SubmissionDetails';

fixture`Acceptance Testing: Base`.meta({ deploymentTest: 'true' });

test('can walk through an nih submission workflow and make a submission - base case', async () => {
  // Log in
  login('nih-user');

  await submissionsPage.startSubmission();

  await submissionBasicPage.inputDoi('10.1039/c7an01256j');
  await submissionBasicPage.validateTitle(
    'Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS'
  );
  await submissionBasicPage.validateJournal('The Analyst');
  await submissionBasicPage.validateTitleAndJournalReadOnly();
  await submissionBasicPage.clickNextToGrants();

  await submissionGrantsPage.selectGrant('QQDV123P7');
  await submissionGrantsPage.clickNextToPolicies();

  await submissionPoliciesPage.verifySelectedPolicy();
  await submissionPoliciesPage.clickNextToRepositories();

  await submissionRepositoriesPage.verifyRequiredRepository(
    'PubMed Central - NATIONAL INSTITUTE OF HEALTH'
  );
  await submissionRepositoriesPage.verifyOptionalRepositorySelected(
    'JScholarship'
  );

  await submissionRepositoriesPage.clickNextToMetadata();

  await submissionMetadataPage.verifyArticleTitle(
    'Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS'
  );
  await submissionMetadataPage.verifyJournalTitle('The Analyst');

  await submissionMetadataPage.clickNextToFiles();

  await submissionFilesPage.uploadFile('my-submission.pdf');
  await submissionFilesPage.clickNextToReview();

  await submissionReviewPage.verifyTitle(
    'Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS'
  );
  await submissionReviewPage.verifyDoi('10.1039/c7an01256j');
  await submissionReviewPage.verifyGrants('QQDV123P7');
  await submissionReviewPage.verifyUploadedFiles('my-submission.pdf');
  await submissionReviewPage.clickSubmit();

  await submissionSubmitDialogPage.acceptJScholarship();
  await submissionSubmitDialogPage.confirmDialog();

  await submissionThankYouPage.verify();
  await submissionThankYouPage.clickSubmissionLink();

  await submissionDetailsPage.verifyTitle(
    'Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS'
  );
  await submissionDetailsPage.verifyDoi('DOI: 10.1039/c7an01256j');
  await submissionDetailsPage.verifySubmissionStatus(
    'The submission was successfully created. PASS will deposit this work into the target repositories and provide a link and feedback where available'
  );
  await submissionDetailsPage.verifyGrants('QQDV123P7');
  await submissionDetailsPage.verifyRepository('JScholarship');
  await submissionDetailsPage.verifyRepository('PubMed Central');

  // Submitted File
  // TODO: won't work due to bad file mocks
  //   const submittedFile = Selector('a').withText('my-submission.pdf');
  //   await t.expect(submittedFile.exists).ok();
}).disablePageCaching;
