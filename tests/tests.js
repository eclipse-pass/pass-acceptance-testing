import { Selector, Role, ClientFunction } from 'testcafe';

const userNih = Role('https://pass.local', async t =>{
    await t
        .doubleClick('#login-button')
        .typeText(Selector('#username'), 'nih-user')
        .typeText(Selector('#password'), 'moo')
        .doubleClick(Selector(".form-element.form-button"));
});

const userIncompleteNih = Role('https://pass.local', async t =>{
    await t
        .doubleClick('#login-button')
        .typeText(Selector('#username'), 'incomplete-nih-user')
        .typeText(Selector('#password'), 'moo')
        .doubleClick(Selector(".form-element.form-button"));
});

const userStaff1 = Role('https://pass.local', async t =>{
    await t
        .doubleClick('#login-button')
        .typeText(Selector('#username'), 'staff1')
        .typeText(Selector('#password'), 'moo')
        .doubleClick(Selector(".form-element.form-button"));
});

const userAdminSubmitter = Role('https://pass.local', async t =>{
    await t
        .click('#login-button')
        .typeText(Selector('#username'), 'admin-submitter')
        .typeText(Selector('#password'), 'moo')
        .click(Selector(".form-element.form-button"));
});

fixture `Acceptance Testing`
    .page`https://pass.local`;

test('can walk through an nih submission workflow and make a submission - base case', async t => {
    // Log in
    await t.useRole(userNih);

    // Go to Submissions
    const submissionsButton = Selector('.nav-link.ember-view').withExactText('Submissions');
    await t.expect(submissionsButton.exists).ok();
    await t.click(submissionsButton);

    var currLocation = ClientFunction(() => window.location.href);
    await t.expect(currLocation()).eql('https://pass.local/app/submissions');

    // Start new Submission
    const startNewSubmissionButton = Selector('.ember-view.btn.btn-primary.btn-small.pull-right').withAttribute('href', '/app/submissions/new');
    await t.expect(startNewSubmissionButton.exists).ok();
    await t.click(startNewSubmissionButton);

    currLocation = ClientFunction(() => window.location.href);
    await t.expect(currLocation()).eql('https://pass.local/app/submissions/new/basics');

    // Input DOI
    const doiInput = Selector('#doi');
    await t.expect(doiInput().exists).ok();
    await t.typeText(doiInput, '10.1039/c7an01256j', { paste: true });
    const toastMessage = Selector('.toast-message').withText("We've pre-populated information from the DOI provided!");
    await t.expect(toastMessage.exists).ok();


    // Check that the title and journal values have been filled in
    const titleName = Selector('#title');
    await t.expect(titleName.value)
        .eql('Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS');

    const journalName = Selector('.form-control').withAttribute('data-test-journal-name-input');
    await t.expect(journalName.value).eql('The Analyst');

    // Check that the title and journal values cannot be edited
    await t.typeText(titleName, 'moo');
    await t.expect(titleName.value)
        .eql('Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS');

    await t.typeText(journalName, 'moo');
    await t.expect(journalName.value).eql('The Analyst');

    // Go to Grants
    const goToGrantsButton = Selector('.btn.btn-primary.pull-right.next');
    await t.expect(goToGrantsButton.exists).ok();
    await t.click(goToGrantsButton);

    currLocation = ClientFunction(() => window.location.href);
    await t.expect(currLocation()).eql('https://pass.local/app/submissions/new/grants');

    // Select a Grant
    const nihGrant = Selector('#grants-selection-table')
        .child('table').child('tbody').child('tr').child('td').withExactText('Eye research (07/01/2017 - 06/30/2022)');
    await t.expect(nihGrant.innerText).eql('Eye research (07/01/2017 - 06/30/2022)');

    await t.doubleClick(nihGrant);
    const submittedGrant = Selector('table').withAttribute('data-test-submission-funding-table')
        .child('tbody').child('tr').child('td').withExactText('Eye research (07/01/2017 - 06/30/2022)');
    await t.expect(submittedGrant.exists).ok();

    // Go to Policies
    const goToPoliciesButton = Selector('button').withAttribute('data-test-workflow-grants-next');
    await t.expect(goToPoliciesButton.exists).ok();
    await t.click(goToPoliciesButton);

    currLocation = ClientFunction(() => window.location.href);
    await t.expect(currLocation()).eql('https://pass.local/app/submissions/new/policies');

    // Check selected Policy
    const currPolicy = Selector('input').withAttribute('data-test-workflow-policies-radio-no-direct-deposit');
    await t.expect(currPolicy.checked).eql(true);

    // Go to Repositories
    const goToRepositoriesButton = Selector('button').withAttribute('data-test-workflow-policies-next');
    await t.expect(goToRepositoriesButton.exists).ok();
    await t.click(goToRepositoriesButton);

    currLocation = ClientFunction(() => window.location.href);
    await t.expect(currLocation()).eql('https://pass.local/app/submissions/new/repositories');

    // Check Required Repositories
    const requiredRepositories = Selector('ul')
        .withAttribute('data-test-workflow-repositories-required-list').child('li').withExactText('PubMed Central - NATIONAL INSTITUTE OF HEALTH');
    await t.expect(requiredRepositories.exists).ok();

    // Check Optional Repositories
    const optionalRepositories = Selector('ul')
        .withAttribute('data-test-workflow-repositories-optional-list').child('li').withExactText('JScholarship');
    await t.expect(optionalRepositories.exists).ok();
    await t.expect(optionalRepositories.child('input').checked).eql(true);

    // Go to Metadata
    const goToMetadataButton = Selector('button').withAttribute('data-test-workflow-repositories-next');
    await t.expect(goToMetadataButton.exists).ok();
    await t.click(goToMetadataButton);

    currLocation = ClientFunction(() => window.location.href);
    await t.expect(currLocation()).eql('https://pass.local/app/submissions/new/metadata');

    // Check Article Title
    const articleTitle = Selector('textarea').withAttribute('name', 'title');
    await t.expect(articleTitle.value)
        .eql('Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS');

    // Check Journal Title
    const journalTitle = Selector('input').withAttribute('name', 'journal-title');
    await t.expect(journalTitle.value)
        .eql('The Analyst');
    
    // Go to Files
    const goToFilesButton = Selector('.alpaca-form-button-Next');
    await t.expect(goToFilesButton.exists).ok();
    await t.click(goToFilesButton);

    currLocation = ClientFunction(() => window.location.href);
    await t.expect(currLocation()).eql('https://pass.local/app/submissions/new/files');

    // Get Browse Files button
    const browseFilesButton = Selector('#file-multiple-input');
    await t.expect(browseFilesButton.exists).ok();

    // Upload File
    await t.setFilesToUpload(browseFilesButton, './uploads/my-submission.pdf');
    const submittedFileDestination = Selector('tr').withAttribute('data-test-added-manuscript-row').child('td').child('a');
    await t.expect(submittedFileDestination.innerText).eql('my-submission.pdf');

    // Go to Review
    const goToReviewButton = Selector('button').withAttribute('data-test-workflow-files-next');
    await t.expect(goToReviewButton.exists).ok();
    await t.click(goToReviewButton);

    currLocation = ClientFunction(() => window.location.href);
    await t.expect(currLocation()).eql('https://pass.local/app/submissions/new/review');

    // Review Title
    const reviewTitle = Selector('.mb-1').withAttribute('data-test-workflow-review-title');
    await t.expect(reviewTitle.innerText)
        .eql('Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS');
    
    // Review DOI
    const reviewDoi = Selector('.mb-1').withAttribute('data-test-workflow-review-doi');
    await t.expect(reviewDoi.innerText).eql('10.1039/c7an01256j');
    
    // Review Grant List
    const reviewGrants = Selector('ul').withAttribute('data-test-workflow-review-grant-list').child('li').withText('Eye research');
    await t.expect(reviewGrants.innerText).contains('Eye research');

    // Review Uploaded File
    const reviewFile = Selector('td').withAttribute('data-test-workflow-review-file-name').withExactText('my-submission.pdf');
    await t.expect(reviewFile.exists).ok();

    // Submit
    const reviewSubmitButton = Selector('button').withAttribute('data-test-workflow-review-submit');
    await t.expect(reviewSubmitButton.exists).ok();
    await t.click(reviewSubmitButton);

    // Agree to terms
    const agreeTermsCheckbox = Selector('#swal2-checkbox').withAttribute('type', 'checkbox');
    await t.expect(agreeTermsCheckbox.checked).eql(false);
    await t.click(agreeTermsCheckbox);
    await t.expect(agreeTermsCheckbox.checked).eql(true);

    // Next Button
    const nextButton = Selector('.swal2-confirm.swal2-styled').withText('Next');
    await t.expect(nextButton.exists).ok();
    await t.click(nextButton);

    // Confirm Button
    const confirmButton = Selector('.swal2-confirm.swal2-styled').withText('Confirm');
    await t.expect(confirmButton.exists).ok();
    await t.click(confirmButton);

    // Thank You Page
    const thankYouHeading = Selector('h1').withExactText('Thank you!');
    await t.expect(thankYouHeading.exists).ok();

    // Click to submittion detail for validation
    const linkToSubmission = Selector('a').withExactText('here');
    await t.expect(linkToSubmission.exists).ok();
    await t.click(linkToSubmission);

    const submissionDetailsBody = Selector('h2').withExactText('Submission Detail');
    await t.expect(submissionDetailsBody.exists).ok();

    // Submission heading
    const submittedHeading = Selector('h5')
        .withExactText('Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS');
    await t.expect(submittedHeading.exists).ok();

    // Submission DOI
    const submittedDoi = Selector('p').withExactText('DOI: 10.1039/c7an01256j');
    await t.expect(submittedDoi.exists).ok();

    // Submission Status
    const submissionStatus = Selector('span').withAttribute('tooltip', 'The submission was successfully created. PASS will deposit this work into the target repositories and provide a link and feedback where available');
    await t.expect(submissionStatus.exists).ok();

    // Grant status
    const submissionGrants = Selector('ul').child('li').withText('Eye research');
    await t.expect(submissionGrants.exists).ok();

    // Repository statuses
    const submissionRepositoryJScholarship = Selector('a').withExactText('JScholarship');
    await t.expect(submissionRepositoryJScholarship.exists).ok();
    // TOOD: work out how to properly do this sort of selector parent-sibling tracing/chaining
    //const submissionRepositoryJScholarshipStatus = Selector(submissionRepositoryJScholarship)().parent(0).sibling(0).child('div').child('div').child('span')
    //    .withAttribute('tooltip','Your submission has been sent to the repository or is in queue to be sent.');
    //await t.expect(submissionRepositoryJScholarshipStatus.exists).ok();

    const submissionRepositoryPubMedCentral = Selector('a').withExactText('PubMed Central');
    await t.expect(submissionRepositoryPubMedCentral.exists).ok();

    // Submitted File
    const submittedFile = Selector('a').withExactText('my-submission.pdf');
    await t.expect(submittedFile.exists).ok();

    //<span tooltip-position="left" tooltip="The submission was successfully created. PASS will deposit this work into the target repositories and provide a link and feedback where available">

});


// .ember-view.btn-link href="app/submissions"