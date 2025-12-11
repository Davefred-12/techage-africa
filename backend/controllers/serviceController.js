// ============================================
// FILE: controllers/serviceController.js
// ============================================
import sendEmail from '../utils/sendEmail.js';

// @desc    Handle service inquiry form submission
// @route   POST /api/public/service-inquiry
// @access  Private (Authenticated users only)
export const submitServiceInquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      service,
      budget,
      timeline,
      message
    } = req.body;

    // Validate required fields
    if (!name || !email || !service || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Get user from auth middleware
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Service mapping for better display
    const services = {
      'web-development': 'Web Development',
      'copywriting': 'Copywriting',
      'seo-optimization': 'SEO Optimization',
      'amazon-kdp': 'Amazon KDP'
    };

    const serviceName = services[service] || service;

    // Prepare email content for admin
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Service Inquiry</h2>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Client Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Project Details</h3>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
          <p><strong>Timeline:</strong> ${timeline || 'Not specified'}</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Message</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>

        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #1e40af;">
            <strong>User Account:</strong> ${user.name} (${user.email})
          </p>
        </div>

        <p style="color: #6b7280; font-size: 14px;">
          This inquiry was submitted through the TechAge Africa website.
        </p>
      </div>
    `;

    // Send email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@techageafrica.com',
      subject: `New Service Inquiry: ${serviceName} - ${name}`,
      html: adminEmailContent,
    });

    // Send confirmation email to user
    const userEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thank You for Your Inquiry!</h2>

        <p>Hi ${name},</p>

        <p>Thank you for your interest in our <strong>${serviceName}</strong> services. We've received your inquiry and will get back to you within 24 hours.</p>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Your Inquiry Summary</h3>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
          <p><strong>Timeline:</strong> ${timeline || 'Not specified'}</p>
        </div>

        <p>Our team will review your requirements and contact you soon with a customized proposal.</p>

        <p>If you have any additional information or questions, feel free to reply to this email.</p>

        <p>Best regards,<br>The TechAge Africa Team</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="color: #6b7280; font-size: 12px;">
          This is an automated response to your service inquiry submitted through techageafrica.com
        </p>
      </div>
    `;

    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: `Service Inquiry Received - ${serviceName}`,
      html: userEmailContent,
    });

    res.status(200).json({
      success: true,
      message: 'Service inquiry submitted successfully'
    });

  } catch (error) {
    console.error('Service inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit service inquiry'
    });
  }
};