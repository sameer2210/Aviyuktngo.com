const crypto = require('crypto');
const paymentModel = require('../models/payment.model');
const { sendMail } = require('./email.service');

const hashToken = token => crypto.createHash('sha256').update(token).digest('hex');

const escapeHtml = value =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getBackendBaseUrl = req => {
  const configuredUrl = process.env.BACKEND_PUBLIC_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/+$/, '');

  const protocol = req.protocol || 'http';
  const host = req.get('host');
  return `${protocol}://${host}`;
};

const formatInr = amountInPaisa =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(amountInPaisa || 0) / 100);

const buildAddress = payment => {
  if (payment.address) return payment.address;

  return [payment.street, payment.city, payment.state, payment.pincode]
    .filter(Boolean)
    .join(', ');
};

const maskAadhaar = aadhaar => {
  const value = String(aadhaar || '').replace(/\D/g, '');
  if (value.length !== 12) return '';

  return `XXXX XXXX ${value.slice(-4)}`;
};

const buildReceiptRows = payment => [
  ['Full Name', payment.name],
  ['Email Address', payment.email],
  ['Aadhaar Number', maskAadhaar(payment.adhar)],
  ['Address', buildAddress(payment)],
  ['Payment ID', payment.paymentId],
  ['Order ID', payment.orderId],
  ['Amount', formatInr(payment.amount)],
  ['Date', payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-IN') : ''],
];

const buildReceiptHtml = payment => {
  const rows = buildReceiptRows(payment)
    .filter(([, value]) => value)
    .map(
      ([label, value]) => `
        <tr>
          <th>${escapeHtml(label)}</th>
          <td>${escapeHtml(value)}</td>
        </tr>`
    )
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Aviyukt NGO Receipt</title>
  <style>
    body { margin: 0; background: #f6f4ef; color: #242424; font-family: Arial, sans-serif; }
    main { max-width: 720px; margin: 32px auto; background: #fff; border: 1px solid #e4e4e4; padding: 32px; }
    h1 { margin: 0 0 4px; font-family: Georgia, serif; font-size: 28px; }
    p { color: #666; margin: 0 0 24px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; border-bottom: 1px solid #eee; padding: 12px; vertical-align: top; }
    th { width: 36%; color: #666; }
    .badge { background: #2b2b29; color: #fff; padding: 10px 14px; text-align: center; margin: 24px 0; font-weight: 700; letter-spacing: 1px; }
    .note { text-align: center; margin-top: 24px; color: #888; font-size: 13px; line-height: 1.6; }
  </style>
</head>
<body>
  <main>
    <h1>Aviyukt NGO</h1>
    <p>Empowering Lives, Spreading Hope</p>
    <div class="badge">DONATION / MEMBERSHIP RECEIPT</div>
    <table>${rows}</table>
    <div class="note">This receipt is valid for tax deduction under Section 80G.<br />Thank you for your generous support.</div>
  </main>
</body>
</html>`;
};

const ensureReceiptLink = async (payment, req) => {
  if (payment.receipt?.url && payment.receipt?.tokenHash) {
    return payment.receipt.url;
  }

  const token = crypto.randomBytes(32).toString('hex');
  const receiptUrl = `${getBackendBaseUrl(req)}/razorpay/receipt/${token}`;

  payment.receipt = {
    ...(payment.receipt || {}),
    tokenHash: hashToken(token),
    url: receiptUrl,
    issuedAt: new Date(),
    emailStatus: 'pending',
  };
  await payment.save();

  return receiptUrl;
};

const deliverReceiptForPayment = async (payment, req) => {
  const receiptUrl = await ensureReceiptLink(payment, req);

  try {
    const result = await sendMail({
      to: payment.email,
      subject: 'Your Aviyukt NGO payment receipt',
      html: `
        <p>Dear ${escapeHtml(payment.name || 'Supporter')},</p>
        <p>Thank you for supporting Aviyukt NGO. Your payment has been verified successfully.</p>
        <p><strong>Amount:</strong> ${escapeHtml(formatInr(payment.amount))}</p>
        <p><strong>Payment ID:</strong> ${escapeHtml(payment.paymentId)}</p>
        <p>You can view your receipt here: <a href="${escapeHtml(receiptUrl)}">${escapeHtml(receiptUrl)}</a></p>
      `,
      text: [
        `Dear ${payment.name || 'Supporter'},`,
        'Thank you for supporting Aviyukt NGO. Your payment has been verified successfully.',
        `Amount: ${formatInr(payment.amount)}`,
        `Payment ID: ${payment.paymentId}`,
        `Receipt: ${receiptUrl}`,
      ].join('\n'),
    });

    payment.receipt.emailStatus = result.skipped ? 'not_configured' : 'sent';
    payment.receipt.emailSentAt = result.skipped ? undefined : new Date();
    payment.receipt.emailError = result.skipped ? result.reason : undefined;
    await payment.save();
  } catch (error) {
    payment.receipt.emailStatus = 'failed';
    payment.receipt.emailError = error.message;
    await payment.save();
  }

  return {
    url: payment.receipt.url,
    emailStatus: payment.receipt.emailStatus,
  };
};

const renderReceiptHtmlByToken = async token => {
  if (!/^[a-f0-9]{64}$/i.test(String(token || ''))) {
    return null;
  }

  const payment = await paymentModel.findOne({
    status: 'completed',
    'receipt.tokenHash': hashToken(token),
  });

  if (!payment) {
    return null;
  }

  return buildReceiptHtml(payment);
};

module.exports = {
  deliverReceiptForPayment,
  renderReceiptHtmlByToken,
};
