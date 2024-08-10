import { REFRESH_TOKEN_VALID_UNTIL } from '../constants/index.js';

export const setupSession = (res, session) => {
  const { refreshToken, _id } = session;
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(REFRESH_TOKEN_VALID_UNTIL),
  });
  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: new Date(REFRESH_TOKEN_VALID_UNTIL),
  });
};
