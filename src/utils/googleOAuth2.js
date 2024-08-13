import { OAuth2Client } from 'google-auth-library';
import path from 'node:path';
import * as fs from 'node:fs/promises';
import { env } from './env.js';
import createHttpError from 'http-errors';
import { GOOGLE_ENV_VARS } from '../constants/index.js';

const PATH_JSON = path.join(process.cwd(), 'google-oauth.json');

const oauthConfig = JSON.parse(await fs.readFile(PATH_JSON, 'utf-8'));

const googleOAuthClient = new OAuth2Client({
  clientId: env(GOOGLE_ENV_VARS.GOOGLE_AUTH_CLIENT_ID),
  clientSecret: env(GOOGLE_ENV_VARS.GOOGLE_AUTH_CLIENT_SECRET),
  redirectUri: oauthConfig.web.redirect_uris[0],
});

export const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);

  if (!response.tokens.id_token) throw createHttpError(401, 'Unauthorized');

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });

  return ticket;
};

export const getFullNameFromGoogleTokenPayload = (googleUserData) => {
  let fullName = 'Guest';
  if (googleUserData.given_name && googleUserData.family_name) {
    fullName = `${googleUserData.given_name} ${googleUserData.family_name}`;
  } else if (googleUserData.given_name) {
    fullName = googleUserData.given_name;
  }

  return fullName;
};
