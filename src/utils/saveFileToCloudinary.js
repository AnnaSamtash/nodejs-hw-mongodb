import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from '../constants/index.js';
import * as fs from 'node:fs/promises';
import { env } from './env.js';

const cloud_name = env(CLOUDINARY.CLOUD_NAME);
const api_key = env(CLOUDINARY.API_KEY);
const api_secret = env(CLOUDINARY.API_SECRET);

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

export const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.uploader.upload(file.path);
  await fs.unlink(file.path);

  return response.secure_url;
};
