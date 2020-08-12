import config from '../config';

const hbs = require('nodemailer-express-handlebars');

export default class MailerService {
  configEmail: any;
  GmailTransport: any;

  constructor() {
    this.GmailTransport = config.MAIL.GmailTransport;
    this.GmailTransport.verify((err: any, success: any) => {
      if (err) {
        console.error(err);
      }
    });

    config.MAIL.ViewOption(this.GmailTransport, hbs);
    this.configEmail = {
      from: `${config.PROJECT} <${config.EMAIL}>`,
      to: '',
      subject: `- ${config.PROJECT}`,
      template: '',
      context: {}
    };
  }

  public async SendWelcomeEmail(user: any) {
    const HelperOptions = {
      ...this.configEmail,
      subject: `Activa tu cuenta ${this.configEmail.subject}`,
      template: 'activation',
      to: user.email,
      context: {
        name: user.fullName,
        email: user.email,
        activationLink: `${config.BASE_URL}/api/auth/confirm-email/${user.uid}`
      }
    };
    await this.sendEmail(HelperOptions);
  }

  public async SendRecoveryEmail(data: any) {
    const HelperOptions = {
      ...this.configEmail,
      subject: `Recuperación de contraseña ${this.configEmail.subject}`,
      template: 'recovery',
      to: data.user.email,
      context: {
        name: data.user.fullName,
        email: data.user.email,
        code: data.code
      }
    };
    await this.sendEmail(HelperOptions);
  }

  private async sendEmail(HelperOptions: any) {
    await this.GmailTransport.sendMail(
      HelperOptions,
      (error: any, info: any) => {
        if (error) {
        }
      }
    );
  }
}
