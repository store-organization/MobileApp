import { resend } from '../config/resend.config.js';

export const SendMail = async (email, otp) => {
  try {
    const to = email;
    const subject = 'Your verification OTP';
    const OTP_EXPIRE_MINUTES = 10;
    const html = `
      <p>Hi ,</p>
      <p>Your Signup verification OTP is <b>${otp}</b>. It expires in ${OTP_EXPIRE_MINUTES} minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
    `;
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // testing ke liye
      to,
      subject,
      html,
    });
    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Email Send Error:', error);
    throw new Error('Email sending failed');
  }
};
