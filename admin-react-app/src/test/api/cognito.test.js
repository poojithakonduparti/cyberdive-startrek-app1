import Amplify, { Auth } from 'aws-amplify';
const config = require('../../aws-exports');

Amplify.default.configure(config);

describe('Cognito User Pool authentication', () => {
  test('Sign up a new user', async () => {
    const username = 'testuser';
    const password = 'testpassword';
    const email = 'testuser@example.com';
    try {
      const result = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  });

  test('Confirm a new user', async () => {
    const username = 'testuser';
    const code = '123456'; // replace with the confirmation code sent to the user's email or phone number
    try {
      const result = await Auth.confirmSignUp(username, code);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  });

  test('Sign in an existing user', async () => {
    const username = 'testuser';
    const password = 'testpassword';
    try {
      const user = await Auth.signIn(username, password);
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  });

  test('Sign out the current user', async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log(error);
    }
  });
});
