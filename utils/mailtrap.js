const pug = require('pug');
const htmlToText = require('html-to-text');
const nodemailer = require('nodemailer');

// new Email(user, url).sendWelcome()
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Natours app <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return 1;
    } 

    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      }
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template 
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject: subject
    });

    // 2) Define email options
     const mailOptions = {
      from: this.from,
      to: this.to, 
      subject: subject, 
      html: html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email 
    await this.newTransport().sendMail(mailOptions); 
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome to the Natours Family!');
  }
}

