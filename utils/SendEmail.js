// /utils/SendEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (to, subject, text, html) => {
  try {
    // 1. Create a transporter object using Gmail's SMTP server
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address from .env
        pass: process.env.EMAIL_PASS, // Your Gmail app password from .env
      },
    });

    // 2. Define the email options
    const mailOptions = {
      from: `"AnandUtsav" <${process.env.EMAIL_USER}>`, // Sender's name and email
      to: to,         // Recipient's email
      subject: subject, // Subject line
      text: text,     // Plain text body
      html: html,     // HTML body
    };

    // 3. Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}, Message ID: ${info.messageId}`);
    
  } catch (error) {
    console.error('Error sending email:', error);
    // In a real app, you might want to handle this error more gracefully
    // For now, we'll just log it.
  }
};