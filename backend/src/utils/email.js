// src/utils/email.js
const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!env.SMTP_HOST) {
    console.warn(
      '[email] SMTP_HOST not configured — emails will be logged to the console instead of sent.'
    );
    return null;
  }
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  return transporter;
}

async function sendMail({ to, subject, html, text }) {
  const t = getTransporter();
  const from = `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`;

  if (!t) {
    // Dev fallback — makes it easy to test the flow without real SMTP creds.
    console.log('──────── [DEV EMAIL] ────────');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log(text || html);
    console.log('──────────────────────────────');
    return { simulated: true };
  }

  return t.sendMail({ from, to, subject, html, text });
}

function passwordResetEmail({ name, resetUrl, expiresMin }) {
  return {
    subject: 'Kuweka upya nywila — Parish Records Portal',
    text: `Habari ${name},\n\nTumepokea ombi la kuweka upya nywila yako. Bofya kiungo kifuatacho ndani ya dakika ${expiresMin} kukamilisha:\n${resetUrl}\n\nKama hukuomba hili, puuza barua pepe hii — akaunti yako iko salama.\n\nParish Records Portal`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#1a6b4a">Kuweka Upya Nywila</h2>
        <p>Habari ${name},</p>
        <p>Tumepokea ombi la kuweka upya nywila ya akaunti yako kwenye <b>Parish Records Portal</b>.</p>
        <p><a href="${resetUrl}" style="background:#1a6b4a;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;display:inline-block">Weka Nywila Mpya</a></p>
        <p>Kiungo hiki kitaisha baada ya dakika ${expiresMin}.</p>
        <p style="color:#888;font-size:13px">Kama hukuomba hili, puuza barua pepe hii. Nywila yako haitabadilika.</p>
      </div>`,
  };
}

function passwordChangedEmail({ name }) {
  return {
    subject: 'Nywila yako imebadilishwa — Parish Records Portal',
    text: `Habari ${name},\n\nNywila ya akaunti yako imebadilishwa hivi punde. Kama hukufanya mabadiliko haya, wasiliana na msimamizi wa mfumo mara moja.`,
    html: `<p>Habari ${name},</p><p>Nywila ya akaunti yako imebadilishwa hivi punde. Kama hukufanya mabadiliko haya, wasiliana na msimamizi wa mfumo mara moja.</p>`,
  };
}

function newUserEmail({ name, email, tempPassword, loginUrl, title }) {
  return {
    subject: 'Akaunti yako ya Parish Records Portal',
    text: `Habari ${name},\n\nUmeongezwa kwenye Parish Records Portal kama ${title || 'mtumiaji'}.\nBarua pepe: ${email}\nNywila ya muda: ${tempPassword}\n\nTafadhali ingia hapa: ${loginUrl}\nUtaombwa kubadilisha nywila mara ya kwanza unapoingia.`,
    html: `<p>Habari ${name},</p><p>Umeongezwa kwenye <b>Parish Records Portal</b> kama <b>${title || 'mtumiaji'}</b>.</p>
      <p>Barua pepe: ${email}<br/>Nywila ya muda: <code>${tempPassword}</code></p>
      <p><a href="${loginUrl}">Ingia kwenye mfumo</a>. Utaombwa kubadilisha nywila mara ya kwanza unapoingia.</p>`,
  };
}

module.exports = { sendMail, passwordResetEmail, passwordChangedEmail, newUserEmail };
