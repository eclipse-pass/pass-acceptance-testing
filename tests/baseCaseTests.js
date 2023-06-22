import { fixture, Selector, test } from 'testcafe';
import { userNih, currLocation, TIMEOUT_LENGTH } from './commonTest';

fixture`Acceptance Testing`.page`https://pass.local`;

test('can walk through an nih submission workflow and make a submission - base case', async (t) => {
  // Log in
  await t.useRole(userNih);

  // Go to Submissions
  const submissionsButton = Selector('.nav-link.ember-view').withText(
    'Submissions'
  );
  await t.expect(submissionsButton.exists).ok();
  await t.click(submissionsButton);

  await t.expect(currLocation()).eql('https://pass.local/app/submissions');

  // Start new Submission
  const startNewSubmissionButton = Selector(
    '.ember-view.btn.btn-primary.btn-small.pull-right'
  ).withAttribute('href', '/app/submissions/new');
  await t.expect(startNewSubmissionButton.exists).ok();
  await t.click(startNewSubmissionButton);

  await t
    .expect(currLocation())
    .eql('https://pass.local/app/submissions/new/basics');

  // Input DOI
  const doiInput = Selector('#doi');
  await t.expect(doiInput().exists).ok();
  await t.typeText(doiInput, '10.1039/c7an01256j', { paste: true });
  const toastMessage = Selector('.flash-message', {
    timeout: TIMEOUT_LENGTH,
  }).withText("We've pre-populated information from the DOI provided!");
  await t.expect(toastMessage.exists).ok();

  // Check that the title and journal values have been filled in
  const titleName = Selector('#title');
  await t
    .expect(titleName.value)
    .eql(
      'Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS'
    );

  const journalName = Selector('.form-control').withAttribute(
    'data-test-journal-name-input'
  );
  await t.expect(journalName.value).eql('The Analyst');

  // Check that the title and journal values cannot be edited
  await t.typeText(titleName, 'moo');
  await t
    .expect(titleName.value)
    .eql(
      'Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS'
    );

  await t.typeText(journalName, 'moo');
  await t.expect(journalName.value).eql('The Analyst');

  // Go to Grants
  const goToGrantsButton = Selector('.btn.btn-primary.pull-right.next');
  await t.expect(goToGrantsButton.exists).ok();
  await t.click(goToGrantsButton);

  await t
    .expect(currLocation())
    .eql('https://pass.local/app/submissions/new/grants');

  // Select a Grant
  const nihGrant = Selector('#grants-selection-table a').withText('QQDV123P7');
  await t.expect(nihGrant.exists).ok().click(nihGrant.parent(0).nextSibling(0));

  const submittedGrant = Selector('table')
    .withAttribute('data-test-submission-funding-table')
    .child('tbody')
    .child('tr')
    .child('td')
    .child('a')
    .withText('QQDV123P7');
  await t.expect(submittedGrant.exists).ok();

  // Go to Policies
  const goToPoliciesButton = Selector('button').withAttribute(
    'data-test-workflow-grants-next'
  );
  await t.expect(goToPoliciesButton.exists).ok();
  await t.click(goToPoliciesButton);

  await t
    .expect(currLocation())
    .eql('https://pass.local/app/submissions/new/policies');

  // Check selected Policy
  const currPolicy = Selector('input').withAttribute(
    'data-test-workflow-policies-radio-no-direct-deposit'
  );
  await t.expect(currPolicy.checked).eql(true);

  // Go to Repositories
  const goToRepositoriesButton = Selector('button').withAttribute(
    'data-test-workflow-policies-next'
  );
  await t.expect(goToRepositoriesButton.exists).ok();
  await t.click(goToRepositoriesButton);

  await t
    .expect(currLocation())
    .eql('https://pass.local/app/submissions/new/repositories');

  // Check Required Repositories
  const requiredRepositories = Selector('ul')
    .withAttribute('data-test-workflow-repositories-required-list')
    .child('li')
    .withText('PubMed Central - NATIONAL INSTITUTE OF HEALTH');
  await t.expect(requiredRepositories.exists).ok();

  // Check Optional Repositories
  const optionalRepositories = Selector('ul')
    .withAttribute('data-test-workflow-repositories-optional-list')
    .child('li')
    .withText('JScholarship');
  await t.expect(optionalRepositories.exists).ok();
  await t.expect(optionalRepositories.child('input').checked).eql(true);

  // Go to Metadata
  const goToMetadataButton = Selector('button').withAttribute(
    'data-test-workflow-repositories-next'
  );
  await t.expect(goToMetadataButton.exists).ok();
  await t.click(goToMetadataButton);

  await t
    .expect(currLocation())
    .eql('https://pass.local/app/submissions/new/metadata');

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
    .eql('https://pass.local/app/submissions/new/files');

  // Get Browse Files button
  const browseFilesButton = Selector('#file-multiple-input');
  await t.expect(browseFilesButton.exists).ok();

  // Upload File
  // TODO: Skipping JS errors while file handling is broken
  await t
    .skipJsErrors(true)
    .setFilesToUpload(browseFilesButton, './uploads/my-submission.pdf')
    .expect(Selector('tr[data-test-added-manuscript-row] td').innerText)
    .eql('my-submission.pdf');

  // Go to Review
  const goToReviewButton = Selector('button').withAttribute(
    'data-test-workflow-files-next'
  );
  await t
    .expect(goToReviewButton.exists)
    .ok()
    .click(goToReviewButton)
    .skipJsErrors(false); // Re-enable JS Error checking

  await t
    .expect(currLocation())
    .eql('https://pass.local/app/submissions/new/review');

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

  // Review Grant List
  const reviewGrants = Selector('ul')
    .withAttribute('data-test-workflow-review-grant-list')
    .child('li')
    .withText('QQDV123P7');
  await t.expect(reviewGrants.innerText).contains('QQDV123P7');

  // Review Uploaded File
  const reviewFile = Selector('td')
    .withAttribute('data-test-workflow-review-file-name')
    .withText('my-submission.pdf');
  await t.expect(reviewFile.exists).ok();

  // Submit
  const reviewSubmitButton = Selector('button').withAttribute(
    'data-test-workflow-review-submit'
  );
  await t.expect(reviewSubmitButton.exists).ok();
  await t.click(reviewSubmitButton);

  // Agree to terms
  const agreeTermsCheckbox = Selector('#swal2-checkbox').withAttribute(
    'type',
    'checkbox'
  );
  await t.expect(agreeTermsCheckbox.checked).eql(false);
  await t.click(agreeTermsCheckbox);
  await t.expect(agreeTermsCheckbox.checked).eql(true);

  // Next Button
  const nextButton = Selector('.swal2-confirm.swal2-styled').withText('Next');
  await t.expect(nextButton.exists).ok();
  await t.click(nextButton);

  // Confirm Button
  const confirmButton = Selector('.swal2-confirm.swal2-styled').withText(
    'Confirm'
  );
  await t.expect(confirmButton.exists).ok();
  await t.click(confirmButton);

  // Thank You Page
  const thankYouHeading = Selector('h1').withText('Thank you!');
  await t.expect(thankYouHeading.exists).ok();

  // Click to submittion detail for validation
  const linkToSubmission = Selector('a').withText('here');
  await t.expect(linkToSubmission.exists).ok();
  await t.click(linkToSubmission);

  const submissionDetailsBody = Selector('h2', {
    timeout: TIMEOUT_LENGTH,
  }).withText('Submission Detail');
  await t.expect(submissionDetailsBody.exists).ok();

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
    'The submission was successfully created. PASS will deposit this work into the target repositories and provide a link and feedback where available'
  );
  await t.expect(submissionStatus.exists).ok();

  // Grant status
  const submissionGrants = Selector('li').withText('QQDV123P7');
  await t.expect(submissionGrants.exists).ok();

  // Repository statuses
  const submissionRepositoryJScholarship =
    Selector('a').withText('JScholarship');
  await t.expect(submissionRepositoryJScholarship.exists).ok();

  const submissionRepositoryPubMedCentral =
    Selector('a').withText('PubMed Central');
  await t.expect(submissionRepositoryPubMedCentral.exists).ok();

  // Submitted File
  // TODO: won't work due to bad file mocks
  //   const submittedFile = Selector('a').withText('my-submission.pdf');
  //   await t.expect(submittedFile.exists).ok();
}).disablePageCaching;
