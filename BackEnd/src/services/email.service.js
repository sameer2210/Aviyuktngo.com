const nodemailer = require('nodemailer');

const getTransporter = () => {
  const service = process.env.EMAIL_SERVICE?.trim();
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();

  if (!service || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service,
    auth: { user, pass },
  });
};

const sendMail = async mailOptions => {
  const transporter = getTransporter();

  if (!transporter) {
    return { skipped: true, reason: 'Email is not configured' };
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    ...mailOptions,
  });

  return { skipped: false };
};

module.exports = { sendMail };
