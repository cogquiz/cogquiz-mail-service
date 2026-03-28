import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'cogquizoutbound@gmail.com',
        pass: process.env.SMTP_PASS || 'lcjjrkezqaqxpdee',
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_USER || 'cogquizoutbound@gmail.com',
        to,
        subject,
        text,
        html,
      });
      console.log('Message sent: %s', info);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendWelcomeEmail(to: string) {
    const subject = 'Welcome to Our App!';
    const text = 'Thank you for joining our app.';
    const encrypted = CryptoJS.AES.encrypt(to, process.env.ENCRYPTION_KEY || 'secret-key').toString();
    const html = `<!DOCTYPE html><html><head><link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"></head><body style="font-family:'roboto';background-color:#f4f4f4;margin:0;padding:0;"><div style="max-width:600px;margin:0 auto;background-color:#ffffff;padding:20px;border:1px solid #ddd;box-shadow:0 2px 5px rgba(0,0,0,0.1);"><p style="font-size:13px;line-height:1.6;color:#211F1C">A request was recently made to reset the password for your Cogquiz account.<br/>Click the link below to verify your email and complete the reset process:</p><p style="font-size:15.2px;line-height:1.6;color:#666"><a style="text-decoration:none;display:inline-block;padding:10px 25px;background-color:#FF914D;color:#0A457A;letter-spacing:2px;border:none;border-radius:20px;text-align:center;text-decoration:none;cursor:pointer;" href='https://cogquiz.com/auth/verify?token=${encrypted}' target="_blank">Verify Account</a></p><p style="font-size:13px;line-height:1.6;color:#211F1C">If you did not submit this request yourself or you suspect an error, please feel free to ignore this email.</p><p style="font-size:13px;line-height:1.6;color:#211F1C">Best regards,</p><p style="font-size:9.7px;line-height:1.6;color:#211F1C;text-align:center;text-transform:uppercase;">You are receiving this email as part of our service.</p></div></body></html>`;

    await this.sendMail(to, subject, text, html);
  }

  async forgotPasswordEmail(email: string) {
    const subject = 'Reset Your Password';
    const text = 'You have requested to reset your password.';
    const encrypted = CryptoJS.AES.encrypt(email, process.env.ENCRYPTION_KEY || 'secret-key').toString();
    const html = `<!DOCTYPE html><html><head><link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"></head><body style="font-family:'roboto';background-color:#f4f4f4;margin:0;padding:0;"><div style="max-width:600px;margin:0 auto;background-color:#ffffff;padding:20px;border:1px solid #ddd;box-shadow:0 2px 5px rgba(0,0,0,0.1);"><p style="font-size:13px;line-height:1.6;color:#211F1C">You request password forgot, please click the button</p><p style="font-size:15.2px;line-height:1.6;color:#666"><a style="text-decoration:none;display:inline-block;padding:10px 25px;background-color:#FF914D;color:#0A457A;letter-spacing:2px;border:none;border-radius:20px;text-align:center;text-decoration:none;cursor:pointer;" href='https://cogquiz.com/auth/forgot-password?token=${encrypted}' target="_blank">Forgot password</a></p><p style="font-size:13px;line-height:1.6;color:#211F1C">If you did not submit this request yourself or you suspect an error, please feel free to ignore this email.</p><p style="font-size:13px;line-height:1.6;color:#211F1C">Best regards,</p><p style="font-size:9.7px;line-height:1.6;color:#211F1C;text-align:center;text-transform:uppercase;">You are receiving this email as part of our service.</p></div></body></html>`;

    await this.sendMail(email, subject, text, html);
  }

  async sentNewPasswordToUser(email: string, password: string) {
    const subject = 'Cogquiz New Password';
    const text = 'Your new password has been sent to your email.';
    const html = `<!DOCTYPE html><html><head><link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"></head><body style="font-family:'roboto';background-color:#f4f4f4;margin:0;padding:0;"><div style="max-width:600px;margin:0 auto;background-color:#ffffff;padding:20px;border:1px solid #ddd;box-shadow:0 2px 5px rgba(0,0,0,0.1);"><p style="font-size:13px;line-height:1.6;color:#211F1C">The administrator changed your password. Please check your new password.</p><p style="font-size:15.2px;line-height:1.6;color:#211F1C">Password:- ${password}</p><p style="font-size:13px;line-height:1.6;color:#211F1C">If you did not submit this request yourself or you suspect an error, please feel free to ignore this email.</p><p style="font-size:13px;line-height:1.6;color:#211F1C">Best regards,</p><p style="font-size:9.7px;line-height:1.6;color:#211F1C;text-align:center;text-transform:uppercase;">You are receiving this email as part of our service.</p></div></body></html>`;

    await this.sendMail(email, subject, text, html);
  }
}
