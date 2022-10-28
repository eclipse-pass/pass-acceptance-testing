import { Selector, Role, ClientFunction } from 'testcafe';

export const userNih = Role('https://pass.local', async t =>{
    await t
        .click('#login-button')
        .typeText(Selector('#username'), 'nih-user')
        .typeText(Selector('#password'), 'moo')
        .click(Selector(".form-element.form-button"));
});

export const userIncompleteNih = Role('https://pass.local', async t =>{
    await t
        .click('#login-button')
        .typeText(Selector('#username'), 'incomplete-nih-user')
        .typeText(Selector('#password'), 'moo')
        .click(Selector(".form-element.form-button"));
});

export const userStaff1 = Role('https://pass.local', async t =>{
    await t
        .click('#login-button')
        .typeText(Selector('#username'), 'staff1')
        .typeText(Selector('#password'), 'moo')
        .click(Selector(".form-element.form-button"));
});

export const userAdminSubmitter = Role('https://pass.local', async t =>{
    await t
        .click('#login-button')
        .typeText(Selector('#username'), 'admin-submitter')
        .typeText(Selector('#password'), 'moo')
        .click(Selector(".form-element.form-button"));
});

export const currLocation = ClientFunction((() => window.location.href));

// set in milliseconds
export const TIMEOUT_LENGTH = parseInt(process.env.TIMEOUT_LENGTH) || 60000;
