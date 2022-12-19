import { Selector, Role, ClientFunction } from 'testcafe';

const LOGIN_URL = 'https://pass.local/login/jhu';

export const userNih = Role(
  LOGIN_URL,
  async (t) => {
    await t
      .typeText(Selector('#username'), 'nih-user')
      .typeText(Selector('#password'), 'moo')
      .click(Selector('.form-element.form-button'));
  },
  { preserveUrl: true }
);

export const userIncompleteNih = Role(
  LOGIN_URL,
  async (t) => {
    await t
      .typeText(Selector('#username'), 'incomplete-nih-user')
      .typeText(Selector('#password'), 'moo')
      .click(Selector('.form-element.form-button'));
  },
  { preserveUrl: true }
);

export const userStaff1 = Role(
  LOGIN_URL,
  async (t) => {
    await t
      .typeText(Selector('#username'), 'staff1')
      .typeText(Selector('#password'), 'moo')
      .click(Selector('.form-element.form-button'));
  },
  { preserveUrl: true }
);

export const userAdminSubmitter = Role(
  LOGIN_URL,
  async (t) => {
    await t
      .typeText(Selector('#username'), 'admin-submitter')
      .typeText(Selector('#password'), 'moo')
      .click(Selector('.form-element.form-button'));
  },
  { preserveUrl: true }
);

export const currLocation = ClientFunction(() => window.location.href);

// set in milliseconds
export const TIMEOUT_LENGTH = parseInt(process.env.TIMEOUT_LENGTH) || 60000;
