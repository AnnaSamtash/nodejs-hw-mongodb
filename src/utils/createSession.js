import { randomBytes } from 'node:crypto';
import {
  ACCESS_TOKEN_VALID_UNTIL,
  REFRESH_TOKEN_VALID_UNTIL,
} from '../constants/index.js';

export const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(ACCESS_TOKEN_VALID_UNTIL),
    refreshTokenValidUntil: new Date(REFRESH_TOKEN_VALID_UNTIL),
  };
};
