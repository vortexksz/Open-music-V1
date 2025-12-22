import nodemailer from 'nodemailer';

class MailSender {
  constructor() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

    this._transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: false, 
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(targetEmail, content) {
    const message = {
      from: 'OpenMusic <no-reply@openmusic.local>',
      to: targetEmail,
      subject: 'Ekspor Playlist - OpenMusic',
      html: 'Terlampir hasil ekspor playlist Anda dalam format JSON.',
      attachments: [
        {
          filename: 'playlists.json',
          content,
        },
      ],
    };

    return this._transporter.sendMail(message);
  }
}

export default MailSender;
