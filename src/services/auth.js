import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { SessionsCollection } from '../db/models/session.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import Handlebars from 'handlebars';
import path from 'node:path';
import * as fs from 'node:fs/promises';
import { createSession } from '../utils/createSession.js';

const findUserByEmail = (email) => UsersCollection.findOne({ email });

export const registerUserService = async (userData) => {
  const { email, password } = userData;
  const user = await findUserByEmail(email);
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(password, 10);

  return await UsersCollection.create({
    ...userData,
    password: encryptedPassword,
  });
};

export const loginUserService = async (loginData) => {
  const { email, password } = loginData;
  const user = await findUserByEmail(email);
  if (!user) throw createHttpError(404, 'User not found');

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  await SessionsCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const LogoutUserService = (sessionId) => {
  SessionsCollection.deleteOne({ _id: sessionId });
};

export const refreshUserSessionService = async ({
  sessionId,
  refreshToken,
}) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired)
    throw createHttpError(401, 'Session token expired');

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestResetTokenService = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw createHttpError(404, 'User not Found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    { expiresIn: '5m' },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = await fs.readFile(resetPasswordTemplatePath, {
    encoding: 'utf-8',
  });
  const template = Handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/auth/reset-password?token=${resetToken}`,
  });
  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPasswordService = async (resetData) => {
  const { token, password } = resetData;
  let entries;
  try {
    entries = jwt.verify(token, env('JWT_SECRET'));
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    )
      throw createHttpError(401, 'Token is expired or invalid.');
    throw error;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  await UsersCollection.findByIdAndUpdate(user._id, {
    password: encryptedPassword,
  });
};
