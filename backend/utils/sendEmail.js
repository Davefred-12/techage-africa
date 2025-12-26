// ============================================
// FILE: backend/utils/sendEmail.js
// ============================================
import { Resend } from 'resend';

// Lazy initialization - create Resend instance only when needed
let resend = null;

const getResendClient = () => {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured in environment variables');
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
};

/**
 * Send email using Resend
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email (can be comma-separated for multiple)
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @param {string} options.from - Optional: 'admin' or 'info' (defaults to 'info')
 * @param {string} options.replyTo - Optional: Reply-to email address
 */
const sendEmail = async (options) => {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY is missing. Skipping email send.');
      console.log('Please add RESEND_API_KEY to your .env file');
      return { success: true, message: 'Email skipped - Resend not configured', skipped: true };
    }

    // Get Resend client (will be created on first use)
    const client = getResendClient();

    // Determine which email to send from
    let fromEmail;
    if (options.from === 'admin') {
      fromEmail = `${process.env.EMAIL_FROM_NAME || 'TechAge Africa'} <${process.env.EMAIL_FROM_ADMIN || 'clinton@techageafrica.com'}>`;
    } else {
      // Default to info email
      fromEmail = `${process.env.EMAIL_FROM_NAME || 'TechAge Africa'} <${process.env.EMAIL_FROM_INFO || 'info@techageafrica.com'}>`;
    }

    // Prepare email data
    const emailData = {
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    // Add reply-to if provided
    if (options.replyTo) {
      emailData.reply_to = options.replyTo;
    }

    // Send email using Resend
    const data = await client.emails.send(emailData);
    
    console.log('✅ Email sent successfully via Resend:', data.id);
    return { 
      success: true, 
      messageId: data.id,
      from: fromEmail,
      to: options.to 
    };
  } catch (error) {
    console.error('❌ Resend email sending failed:', error);
    
    // Log more details for debugging
    if (error.message) {
      console.error('Error message:', error.message);
    }
    if (error.statusCode) {
      console.error('Status code:', error.statusCode);
    }
    
    throw new Error(`Failed to send email: ${error.message || 'Unknown error'}`);
  }
};

/**
 * Send email to both user and admin
 * Useful for contact forms, inquiries, etc.
 */
export const sendDualEmail = async ({ userEmail, adminEmail, userSubject, adminSubject, userHtml, adminHtml }) => {
  try {
    const results = [];

    // Send to user
    if (userEmail && userSubject && userHtml) {
      const userResult = await sendEmail({
        to: userEmail,
        subject: userSubject,
        html: userHtml,
        from: 'info', // Use info@ for customer-facing emails
      });
      results.push({ type: 'user', ...userResult });
    }

    // Send to admin
    if (adminEmail && adminSubject && adminHtml) {
      const adminResult = await sendEmail({
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml,
        from: 'admin', // Use clinton@ for admin notifications
      });
      results.push({ type: 'admin', ...adminResult });
    }

    console.log('✅ Dual email sent successfully');
    return { success: true, results };
  } catch (error) {
    console.error('❌ Dual email sending failed:', error);
    throw error;
  }
};

/**
 * Send newsletter subscription confirmation
 */
export const sendNewsletterEmail = async (email, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0284c7 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #0284c7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to TechAge Africa! 🎉</h1>
          </div>
          <div class="content">
            <p>Hi ${name || 'there'},</p>
            <p>Thank you for subscribing to our newsletter! We're excited to have you join our community.</p>
            <p>You'll now receive:</p>
            <ul>
              <li>Latest updates on our courses and services</li>
              <li>Exclusive tips and resources</li>
              <li>Special offers and promotions</li>
              <li>Industry insights and trends</li>
            </ul>
            <a href="${process.env.CLIENT_URL}" class="button">Visit Our Website</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} TechAge Africa. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: 'Welcome to TechAge Africa Newsletter! 🎉',
    html,
    from: 'info',
  });
};

/**
 * Send admin notification for new newsletter subscriber
 */
export const sendNewsletterAdminNotification = async (email, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0284c7; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; }
          .info-box { background: white; padding: 15px; border-left: 4px solid #0284c7; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Newsletter Subscriber 📧</h2>
          </div>
          <div class="content">
            <p>A new user has subscribed to your newsletter:</p>
            <div class="info-box">
              <strong>Name:</strong> ${name || 'Not provided'}<br>
              <strong>Email:</strong> ${email}<br>
              <strong>Date:</strong> ${new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({
    to: process.env.ADMIN_EMAIL || 'clinton@techageafrica.com',
    subject: `New Newsletter Subscriber: ${email}`,
    html,
    from: 'admin',
  });
};

export default sendEmail;