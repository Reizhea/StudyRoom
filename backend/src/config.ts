import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export const EMAIL_USER = process.env.EMAIL_USER || '';
export const EMAIL_PASS = process.env.EMAIL_PASS || '';
export const MONGO_URI = process.env.MONGO_URI || '';
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const PORT = process.env.PORT || '5000';
