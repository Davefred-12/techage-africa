// ============================================
// FILE: backend/utils/sendEmail.js
// ============================================
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    // Check if email configuration is available
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email configuration missing. Skipping email send.');
      console.log('Required environment variables: EMAIL_HOST, EMAIL_USER, EMAIL_PASS');
      // Don't throw error, just return success to prevent breaking the flow
      return { success: true, message: 'Email skipped - configuration missing', skipped: true };
    }

    // Create transporter
    // For development, we'll use Gmail or a test account
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    // Email options
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'TechAge Africa'} <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

export default sendEmail;