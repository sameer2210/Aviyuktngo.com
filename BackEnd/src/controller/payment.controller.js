const paymentModel = require('../models/payment.model');
const Razorpay = require('razorpay');
const { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');
const { deliverReceiptForPayment, renderReceiptHtmlByToken } = require('../services/receipt.service');

const getRazorpayCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    return null;
  }

  return { keyId, keySecret };
};

const createRazorpayClient = () => {
  const credentials = getRazorpayCredentials();
  if (!credentials) return null;

  return new Razorpay({
    key_id: credentials.keyId,
    key_secret: credentials.keySecret,
  });
};

const paymentcreate = async (req, res) => {
  const { name, email, adhar, address, occupation, street, city, state, pincode, gender } = req.body;
  const amountInRupees = Number(req.body.amount);

  if (!Number.isFinite(amountInRupees) || amountInRupees <= 0) {
    return res.status(400).json({ message: 'Invalid payment amount' });
  }

  const razorpay = createRazorpayClient();
  if (!razorpay) {
    return res.status(500).json({ message: 'Razorpay keys are not configured on the server' });
  }

  const options = {
    amount: Math.round(amountInRupees * 100), // amount in paisa
    currency: 'INR',
  };

  try {
    const order = await razorpay.orders.create(options);

    const newPayment = await paymentModel.create({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      name,
      email,
      adhar,
      address,
      occupation,
      street,
      city,
      state,
      pincode,
      gender,
      status: 'pending',
    });

    return res.json({ order, newPayment });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

const paymentverify = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const credentials = getRazorpayCredentials();

  if (!credentials) {
    return res.status(500).json({ message: 'Razorpay keys are not configured on the server' });
  }

  if (!razorpayOrderId || !razorpayPaymentId || !signature) {
    return res.status(400).json({ message: 'Missing payment verification fields' });
  }

  try {
    const isValid = validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
      signature,
      credentials.keySecret
    );

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const payment = await paymentModel.findOne({ orderId: razorpayOrderId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    payment.paymentId = razorpayPaymentId;
    payment.signature = signature;
    payment.status = 'completed';
    await payment.save();

    const receipt = await deliverReceiptForPayment(payment, req);

    return res.json({ status: 'success', receipt });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};

const viewReceipt = async (req, res) => {
  try {
    const receiptHtml = await renderReceiptHtmlByToken(req.params.token);

    if (!receiptHtml) {
      return res.status(404).send('Receipt not found');
    }

    res.set('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(receiptHtml);
  } catch (error) {
    console.error('Receipt render error:', error);
    return res.status(500).send('Unable to load receipt');
  }
};

const getPaymentHistory = async (req, res) => {
  const { adhar } = req.body;

  if (!/^\d{12}$/.test(String(adhar || ''))) {
    return res.status(400).json({ message: 'Invalid Aadhaar number' });
  }

  try {
    const history = await paymentModel.find({ adhar }).sort({ createdAt: -1 });
    return res.status(200).json(history);
  } catch (error) {
    console.error('Payment history error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all payments for admin panel
const getAllPaymentsAdmin = async (req, res) => {
  try {
    // Get all payments sorted by newest first
    const allPayments = await paymentModel.find().sort({ createdAt: -1 });

    if (!allPayments) {
      return res.status(200).json([]);
    }

    return res.status(200).json(allPayments);
  } catch (error) {
    console.error('Error fetching all payments:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { paymentcreate, paymentverify, viewReceipt, getPaymentHistory, getAllPaymentsAdmin };
