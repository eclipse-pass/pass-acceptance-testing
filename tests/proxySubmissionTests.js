import { fixture, Selector, test } from 'testcafe';
import {
  currLocation,
  TIMEOUT_LENGTH,
  login,
  logout,
  PASS_BASE_URL,
} from './commonTest';
import submissionsPage from './page_model/Submissions';
import submissionBasic from './page_model/SubmissionBasic';
import submissionGrantsPage from './page_model/SubmissionGrants';
import submissionPoliciesPage from './page_model/SubmissionPolicies';
import submissionRepositoriesPage from './page_model/SubmissionRepositories';

fixture`Acceptance Testing: Proxy Submission`.afterEach(logout);

test('can walk through a proxy submission workflow and make a submission - with pass account', async (t) => {
  // use role
  // await t.useRole(userAdminSubmitter);
  login('admin-submitter');

  // Start new Submission
  await submissionsPage.startSubmission();

  // Select Proxy Submission button
  const proxyRadioButton = Selector('input').withAttribute(
    'data-test-proxy-radio-button'
  );
  await t.expect(proxyRadioButton.exists).ok();
  await t.click(proxyRadioButton);

  const proxyInputBlock = Selector('#proxy-input-block');
  await t.expect(proxyInputBlock.exists).ok();

  // Input search term
  const proxySearchInput = Selector('input').withAttribute(
    'data-test-proxy-search-input'
  );
  await t.expect(proxySearchInput.exists).ok();
  await t.typeText(proxySearchInput(), 'nihuser');
  await t.expect(proxySearchInput.value).eql('nihuser');
  const searchForUsers = Selector('#search-for-users');
  await t.expect(searchForUsers.exists).ok();
  await t.click(searchForUsers);

  // Check search results
  const searchResultsModal = Selector('.ember-modal-dialog');
  await t.expect(searchResultsModal.exists).ok();
  const userHasGrantsLink = Selector('a')
    .withAttribute('data-test-found-proxy-user')
    .withText('nihuser@jhu.edu');
  await t.expect(userHasGrantsLink.exists).ok();
  // Select Submitter
  await t.click(userHasGrantsLink);
  await t.expect(searchResultsModal.exists).notOk();

  const selectedUser = Selector('p').withText('Currently selected submitter:');
  await t.expect(selectedUser.innerText).contains('Nihu Ser');

  await walkThroughSubmissionFlow(t, true);
}).disablePageCaching;

test('can walk through a proxy submission workflow and make a submission - without pass account', async (t) => {
  // use role
  // await t.useRole(userAdminSubmitter);
  login('admin-submitter');

  // Go to Submissions
  // Start new Submission
  await submissionsPage.startSubmission();

  // Select Proxy Submission button
  await t
    .expect(currLocation())
    .eql(`${PASS_BASE_URL}/app/submissions/new/basics`);
  const proxyRadioButton = Selector('input').withAttribute(
    'data-test-proxy-radio-button'
  );
  await t.expect(proxyRadioButton.exists).ok();
  await t.click(proxyRadioButton);

  const proxyInputBlock = Selector('#proxy-input-block');
  await t.expect(proxyInputBlock.exists).ok();

  // Input name and email of submitter
  const submitterEmailInput = Selector('input').withAttribute(
    'data-test-proxy-submitter-email-input'
  );
  await t.expect(submitterEmailInput.exists).ok();
  await t.typeText(submitterEmailInput, 'nopass@account.com');
  await t.expect(submitterEmailInput.value).eql('nopass@account.com');

  const submitterNameInput = Selector('input').withAttribute(
    'data-test-proxy-submitter-name-input'
  );
  await t.expect(submitterNameInput.exists).ok();
  await t.typeText(submitterNameInput, 'John Moo');
  await t.expect(submitterNameInput.value).eql('John Moo');

  await walkThroughSubmissionFlow(t, false);
}).disablePageCaching;

// t should be the test's promise, hasAccount should be a Bool
async function walkThroughSubmissionFlow(t, hasAccount) {
  await submissionBasic.inputDoi('10.1039/c7an01256j');
  await submissionBasic.validateTitle(
    'Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS'
  );
  await submissionBasic.validateJournal('The Analyst');
  await submissionBasic.validateTitleAndJournalReadOnly();

  await submissionBasic.clickNextToGrants();

  if (hasAccount) {
    await submissionGrantsPage.selectGrant('R01EY012124');
  } else {
    // Check that the No Account message is appearing
    const hasNoGrantsMessage = Selector('p').withAttribute(
      'data-test-workflow-grants-no-account-message'
    );
    await t
      .expect(hasNoGrantsMessage.innerText)
      .eql(
        'Because the person you are submitting on behalf of is not yet in our system, PASS does not have information about his/her grant(s) and cannot associate this submission with a grant. Please click Next to continue.'
      );
  }

  await submissionGrantsPage.clickNextToPolicies();

  // Nothing to select here, move to Repositories page
  await submissionPoliciesPage.clickNextToRepositories();

  // Check Required Repositories
  if (hasAccount) {
    await submissionRepositoriesPage.verifyRequiredRepository('PubMed Central');
  } else {
    await submissionRepositoriesPage.verifyRequiredRepository('JScholarship');
  }

  await submissionRepositoriesPage.clickNextToMetadata();

  // Check Article Title
  const articleTitle = Selector('textarea').withAttribute('name', 'title');
  await t
    .expect(articleTitle.value)
    .eql(
      'Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS'
    );

  // Check Journal Title
  const journalTitle = Selector('input').withAttribute('name', 'journal-title');
  await t.expect(journalTitle.value).eql('The Analyst');

  // Go to Files
  const goToFilesButton = Selector('.alpaca-form-button-Next');
  await t.expect(goToFilesButton.exists).ok();
  await t.click(goToFilesButton);

  await t
    .expect(currLocation())
    .eql(`${PASS_BASE_URL}/app/submissions/new/files`);

  await t.expect(Selector('div[data-test-foundmss-component]').exists).ok();

  // Upload no file here
  const goToReviewButton = Selector('button').withAttribute(
    'data-test-workflow-files-next'
  );
  await t.expect(goToReviewButton.exists).ok();
  await t.click(goToReviewButton);

  const noManuscriptAlert = Selector('#swal2-title').withText(
    'No manuscript present'
  );
  await t.expect(noManuscriptAlert.exists).ok();

  const nextPageButton = Selector('.swal2-confirm').withText('OK');
  await t.expect(nextPageButton.exists).ok();
  await t.click(nextPageButton);

  await t
    .expect(currLocation())
    .eql(`${PASS_BASE_URL}/app/submissions/new/review`);

  // Go to Review
  // Review Title
  const reviewTitle = Selector('.mb-1').withAttribute(
    'data-test-workflow-review-title'
  );
  await t
    .expect(reviewTitle.innerText)
    .eql(
      'Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS'
    );

  // Review DOI
  const reviewDoi = Selector('.mb-1').withAttribute(
    'data-test-workflow-review-doi'
  );
  await t.expect(reviewDoi.innerText).eql('10.1039/c7an01256j');

  // Rf grants are present, review here
  if (hasAccount) {
    const reviewGrants = Selector('ul')
      .withAttribute('data-test-workflow-review-grant-list')
      .child('li')
      .withText('R01EY012124');
    await t.expect(reviewGrants.innerText).contains('R01EY012124');
  }

  // Review that this is a proxy submission
  const submitterComment = Selector('p')
    .withAttribute('data-test-workflow-review-submitter')
    .withText('This submission is prepared on behalf of');
  await t.expect(submitterComment.exists).ok();
  if (hasAccount) {
    await t.expect(submitterComment.innerText).contains('Nihu Ser');
  } else {
    await t.expect(submitterComment.innerText).contains('John Moo');
  }

  // Submit
  const reviewSubmitButton = Selector('button').withAttribute(
    'data-test-workflow-review-submit'
  );
  await t.expect(reviewSubmitButton.innerText).eql('Request approval');
  await t.click(reviewSubmitButton);

  // Thank You Page
  const thankYouHeading = Selector('h1', {
    timeout: TIMEOUT_LENGTH,
  }).withText('Thank you!');
  await t.expect(thankYouHeading.exists).ok();

  // Click to submittion detail for validation
  const linkToSubmission = Selector('a').withText('here');
  await t.expect(linkToSubmission.exists).ok();
  await t.click(linkToSubmission);

  // Submission heading
  const submittedHeading = Selector('h5').withText(
    'Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS'
  );
  await t.expect(submittedHeading.exists).ok();

  // Submission DOI
  const submittedDoi = Selector('p').withText('DOI: 10.1039/c7an01256j');
  await t.expect(submittedDoi.exists).ok();

  // Submission Status
  const submissionStatus = Selector('span').withAttribute(
    'tooltip',
    'This submission has been prepared on behalf of the designated submitter and is awaiting approval before being submitted.'
  );
  await t.expect(submissionStatus.exists).ok();

  // Grant status
  if (hasAccount) {
    const submissionGrants = Selector('li').withText('R01EY012124');
    await t.expect(submissionGrants.exists).ok();
  }
}
