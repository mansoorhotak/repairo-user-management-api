/**
 * Email Service
 * Handles email functionality using Nodemailer with Gmail SMTP
 * Provides welcome email and forgot password email services
 */
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'itxalexkhan@gmail.com',
        pass: process.env.SMTP_PASS || 'jaix eyna cyfi apxu'
      }
    });

    this.senderEmail = process.env.SMTP_USER || 'itxalexkhan@gmail.com';
    this.senderName = process.env.SENDER_NAME || 'RepairO Team';
  }

  /**
   * Send email using Nodemailer with Gmail SMTP
   * @param {Object} emailData - Email data object
   * @returns {Promise<Object>} API response
   */
  async sendEmail(emailData) {
    try {
      const mailOptions = {
        from: `"${this.senderName}" <${this.senderEmail}>`,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.response);
      return { message: 'Email sent successfully', info };
    } catch (error) {
      console.error('Error sending email:', error.message);
      throw new Error('Failed to send email');
    }
  }



  /**
   * Send welcome email to new user
   * @param {Object} user - User object with name and email
   * @returns {Promise<Object>} API response
   */
  async sendWelcomeEmail(user) {
    try {
      const emailData = {
        to: user.email,
        subject: 'Welcome to RepairO - Your Account is Ready!',
        html: this.generateWelcomeEmailHTML(user),
        text: this.generateWelcomeEmailText(user)
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      // Log the error but don't fail the registration process
      console.error('Failed to send welcome email:', error.message);
      console.log('💡 To fix this, check Gmail SMTP configuration');
      
      // Return a success response to not break the registration flow
      return { message: 'User registered successfully (email service temporarily unavailable)' };
    }
  }

    /**
   * Send forgot password email
   * @param {Object} user - User object with name and email
   * @param {string} resetToken - Password reset token
   * @param {string} resetUrl - Password reset URL
   * @returns {Promise<Object>} API response
   */
  async sendForgotPasswordEmail(user, resetToken, resetUrl) {
    try {
      const emailData = {
        to: user.email,
        subject: 'Reset Your RepairO Password',
        html: this.generateForgotPasswordEmailHTML(user, resetUrl),
        text: this.generateForgotPasswordEmailText(user, resetUrl)
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      // Log the error and provide helpful information
      console.error('Failed to send forgot password email:', error.message);
      console.log('💡 To fix this, check Gmail SMTP configuration');
      
      // Re-throw the error for forgot password since it's critical
      throw new Error('Email service unavailable. Please contact support for password reset.');
    }
  }

  /**
   * Generate HTML content for welcome email
   * @param {Object} user - User object
   * @returns {string} HTML content
   */
  generateWelcomeEmailHTML(user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to RepairO</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔧 Welcome to RepairO!</h1>
            <p>Your trusted platform for home repairs and services</p>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName}!</h2>
            <p>Welcome to RepairO! We're excited to have you on board. Your account has been successfully created and you're now ready to connect with skilled service providers or offer your services to customers.</p>
            
            <h3>What you can do now:</h3>
            <ul>
              <li>📋 Complete your profile</li>
              <li>🔍 Browse service providers</li>
              <li>📞 Book appointments</li>
              <li>⭐ Leave reviews</li>
              <li>💬 Contact support</li>
            </ul>
            
            <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
            
            <div style="text-align: center;">
              <a href="#" class="button">Get Started</a>
            </div>
          </div>
          <div class="footer">
            <p>© 2025 RepairO. All rights reserved.</p>
            <p>This email was sent to ${user.email}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate text content for welcome email
   * @param {Object} user - User object
   * @returns {string} Text content
   */
  generateWelcomeEmailText(user) {
    return `
Welcome to RepairO!

Hello ${user.firstName}!

Welcome to RepairO! We're excited to have you on board. Your account has been successfully created and you're now ready to connect with skilled service providers or offer your services to customers.

What you can do now:
- Complete your profile
- Browse service providers
- Book appointments
- Leave reviews
- Contact support

If you have any questions or need assistance, don't hesitate to reach out to our support team.

Best regards,
The RepairO Team

© 2025 RepairO. All rights reserved.
    `;
  }

  /**
   * Generate HTML content for forgot password email
   * @param {Object} user - User object
   * @param {string} resetUrl - Password reset URL
   * @returns {string} HTML content
   */
  generateForgotPasswordEmailHTML(user, resetUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Your Password</h1>
            <p>RepairO Account Security</p>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName}!</h2>
            <p>We received a request to reset your password for your RepairO account. If you didn't make this request, you can safely ignore this email.</p>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
            </div>
            
            <p>To reset your password, click the button below:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            
            <p>If you have any questions or need assistance, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>© 2025 RepairO. All rights reserved.</p>
            <p>This email was sent to ${user.email}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate text content for forgot password email
   * @param {Object} user - User object
   * @param {string} resetUrl - Password reset URL
   * @returns {string} Text content
   */
  generateForgotPasswordEmailText(user, resetUrl) {
    return `
Reset Your Password

Hello ${user.firstName}!

We received a request to reset your password for your RepairO account. If you didn't make this request, you can safely ignore this email.

IMPORTANT: This link will expire in 1 hour for security reasons.

To reset your password, visit this link:
${resetUrl}

If you have any questions or need assistance, please contact our support team.

Best regards,
The RepairO Team

© 2025 RepairO. All rights reserved.
    `;
  }
}

module.exports = new EmailService();
