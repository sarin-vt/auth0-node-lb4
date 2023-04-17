import {CreateUserData} from 'auth0';

const getUserIdFromEmail = (email: string) => {
  return email?.split('@')[0] ?? email;
}

const getDefaultStrongPassword = () => {
  return new Array(12).fill(0).map(() => String.fromCharCode(Math.random() * 86 + 40)).join("")
}

export const getAuth0UserData = (email: string, orgId: string):
  CreateUserData => {
  const userId = getUserIdFromEmail(email);
  const userPassword = getDefaultStrongPassword();

  return {
    "email": email,
    "user_metadata": {
      "org_id": orgId
    },
    "blocked": false,
    "app_metadata": {},
    "given_name": userId,
    "family_name": userId,
    "name": userId,
    "nickname": userId,
    "connection": `database-${orgId}`,
    "password": userPassword,
    "verify_email": true
  }
}

