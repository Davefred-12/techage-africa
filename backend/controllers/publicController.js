// ============================================
// FILE: backend/controllers/publicController.js - NEW
// ============================================
import Newsletter from '../models/Newsletter.js';
import Contact from '../models/Contact.js';
import sendEmail from '../utils/sendEmail.js';

// ============================================
// 📬 NEWSLETTER SUBSCRIPTION
// ============================================

// @desc    Subscribe to newsletter
// @route   POST /api/public/subscribe
// @access  Public
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    console.log('📬 Newsletter subscription request:', email);

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });

    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return res.status(400).json({
          success: false,
          message: 'This email is already subscribed!',
        });
      } else {
        // Reactivate subscription
        existingSubscriber.status = 'active';
        existingSubscriber.subscribedAt = Date.now();
        existingSubscriber.unsubscribedAt = null;
        await existingSubscriber.save();

        console.log('✅ Newsletter subscription reactivated');

        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
        });
      }
    }

    // Create new subscriber
    const subscriber = await Newsletter.create({ email });

    // Send welcome email to subscriber
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to TechAge Africa Newsletter! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0284c7 0%, #f59e0b 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to TechAge Africa! 🎉</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Thank you for subscribing!</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                You're now part of our community of 5000+ tech enthusiasts! 🚀
              </p>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                Here's what you can expect:
              </p>
              
              <ul style="color: #4b5563; font-size: 16px; line-height: 1.8;">
                <li>📚 Latest course updates and new releases</li>
                <li>💡 Tech insights and industry trends</li>
                <li>🎁 Exclusive discounts and early access</li>
                <li>🌟 Success stories from our students</li>
              </ul>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL}/courses" 
                   style="background: #0284c7; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                  Explore Our Courses
                </a>
              </div>
              
              <p style="color: #9ca3af; font-size: 14px; margin-top: 30px; text-align: center;">
                No spam, ever. <a href="${process.env.FRONTEND_URL}/unsubscribe?email=${email}" style="color: #0284c7;">Unsubscribe anytime</a>.
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('⚠️ Welcome email failed:', emailError);
      // Don't fail the whole request if email fails
    }

    // Send notification to admin
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: '📬 New Newsletter Subscription',
        html: `
          <h2>New Newsletter Subscriber</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Total Subscribers:</strong> ${await Newsletter.countDocuments({ status: 'active' })}</p>
        `,
      });
    } catch (emailError) {
      console.error('⚠️ Admin notification failed:', emailError);
    }

    console.log('✅ Newsletter subscription successful');

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed! Check your email for confirmation.',
      data: { email: subscriber.email },
    });
  } catch (error) {
    console.error('❌ Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe. Please try again.',
      error: error.message,
    });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/public/unsubscribe
// @access  Public
export const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our subscription list',
      });
    }

    if (subscriber.status === 'unsubscribed') {
      return res.status(400).json({
        success: false,
        message: 'This email is already unsubscribed',
      });
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = Date.now();
    await subscriber.save();

    console.log('✅ Newsletter unsubscribed:', email);

    res.status(200).json({
      success: true,
      message: 'You have been unsubscribed successfully',
    });
  } catch (error) {
    console.error('❌ Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe',
    });
  }
};

// ============================================
// 📨 CONTACT FORM
// ============================================

// @desc    Submit contact form
// @route   POST /api/public/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields',
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    console.log('📨 Contact form submission:', { name, email, subject });

    // Save to database
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    // Send email to admin/support team
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `🔔 New Contact Form: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 30px; border-radius: 10px;">
            <h2 style="color: #0284c7; border-bottom: 3px solid #0284c7; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 10px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
              <h3 style="color: #1f2937; margin-top: 0;">Message:</h3>
              <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${email}" 
                 style="background: #0284c7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Reply to ${name}
              </a>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('⚠️ Admin email failed:', emailError);
    }

    // Send confirmation email to user
    try {
      await sendEmail({
        to: email,
        subject: 'We received your message! ✅',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0284c7 0%, #f59e0b 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Contacting Us! ✅</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937;">Hi ${name},</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                We've received your message and our team will get back to you within <strong>24 hours</strong>.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #0284c7; margin: 20px 0;">
                <p style="margin: 5px 0; color: #6b7280;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Your Message:</strong></p>
                <p style="color: #4b5563; margin-top: 10px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                In the meantime, feel free to explore our courses or check out our FAQ section.
              </p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL}/courses" 
                   style="background: #0284c7; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 0 10px;">
                  Browse Courses
                </a>
                <a href="${process.env.FRONTEND_URL}/contact#faq" 
                   style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 0 10px;">
                  View FAQs
                </a>
              </div>
              
              <p style="color: #9ca3af; font-size: 14px; margin-top: 30px; text-align: center;">
                Best regards,<br>
                <strong>The TechAge Africa Team</strong>
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('⚠️ User confirmation email failed:', emailError);
    }

    console.log('✅ Contact form submitted successfully');

    res.status(201).json({
      success: true,
      message: "Message sent successfully! We'll respond within 24 hours.",
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
      },
    });
  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.',
      error: error.message,
    });
  }
};