import * as nodemailer from 'nodemailer';
import { EmailData } from '../../../shared/types';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(emailData: EmailData): Promise<void> {
    try {
      const html = this.markdownToHtml(emailData.markdown);

      const mailOptions = {
        from: '"星语占星社" <noreply@astrology-club.com>',
        to: emailData.to,
        subject: emailData.subject,
        html: html,
        text: emailData.markdown
      };

      console.log(`📧 模拟发送邮件到: ${emailData.to}`);
      console.log(`📧 邮件主题: ${emailData.subject}`);
      console.log(`📧 邮件内容预览:\n${emailData.markdown.substring(0, 200)}...`);
    } catch (error) {
      console.error('邮件发送错误:', error);
      throw new Error('邮件发送失败');
    }
  }

  private markdownToHtml(markdown: string): string {
    let html = markdown
      .replace(/^# (.*$)/gm, '<h1 style="color: #4a148c; font-size: 24px;">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 style="color: #6a1b9a; font-size: 20px; margin-top: 20px;">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 style="color: #7b1fa2; font-size: 18px;">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #8e24aa;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gm, '<li style="margin: 8px 0;">$1</li>')
      .replace(/^(#{1,6}\s.*)$/gm, '<p style="margin: 16px 0;">$1</p>')
      .replace(/\n\n/g, '</p><p style="margin: 16px 0; line-height: 1.6;">')
      .replace(/---/g, '<hr style="border: none; border-top: 2px solid #e1bee7; margin: 20px 0;">');

    return `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); font-family: 'Microsoft YaHei', sans-serif;">
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 8px 32px rgba(74, 20, 140, 0.1);">
          <p style="margin: 16px 0; line-height: 1.6;">${html}</p>
          <div style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
            <p>✨ 星语占星社 · 让星座点亮你的生活 ✨</p>
          </div>
        </div>
      </div>
    `;
  }
}
