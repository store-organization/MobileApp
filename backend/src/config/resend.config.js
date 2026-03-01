import { Resend } from 'resend';
import { envConfig } from './env.config.js';

export const resend = new Resend(envConfig.RESEND_API_KEY);
