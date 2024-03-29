import { Selector, ClientFunction, t } from 'testcafe';

const LOGIN_URL = 'https://pass.local/login/saml';

export const USER = {
  NIH_USER: 'nih-user',
  ADMIN_SUBMITTER: 'admin-submitter',
};

export async function login(usr) {
  return await t
    .navigateTo(LOGIN_URL)
    .typeText('#username', usr)
    .typeText('#password', 'moo')
    .click('.form-element.form-button');
}

export async function logout() {
  return await t
    .click('#user-menu-name') // Open the app menu to make logout btn visible
    .click(Selector('#user-menu a').withText('Logout'));
}

export const currLocation = ClientFunction(() => window.location.href);

// set in milliseconds
export const TIMEOUT_LENGTH = parseInt(process.env.TIMEOUT_LENGTH) || 60000;
