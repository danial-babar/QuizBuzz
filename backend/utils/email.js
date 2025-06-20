const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');
const { ErrorResponse } = require('./errorResponse');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name ? user.name.split(' ')[0] : 'User';
    this.url = url;
    this.from = `QuizBuzz <${process.env.EMAIL_FROM || 'noreply@quizbuzz.com'}>`;
  }

  // Create a transporter
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Use SendGrid for production
      return nodemailer.createTransport({
        service: 'SendGrid', // No need to set host or port etc.
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    // Use Mailtrap for development
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
      port: process.env.EMAIL_PORT || 2525,
      auth: {
        user: process.env.EMAIL_USERNAME || 'your_mailtrap_username',
        pass: process.env.EMAIL_PASSWORD || 'your_mailtrap_password'
      }
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    );

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html, { wordwrap: 130 })
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to QuizBuzz!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10 minutes)'
    );
  }

  async sendEmailVerification() {
    await this.send(
      'emailVerification',
      'Verify your email address (valid for 24 hours)'
    );
  }

  async sendQuizInvitation(quizTitle, inviterName) {
    await this.send(
      'quizInvitation',
      `${inviterName} has invited you to take a quiz: ${quizTitle}`
    );
  }
}

module.exports = Email;
