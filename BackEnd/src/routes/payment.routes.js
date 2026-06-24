const express = require('express');
const { paymentcreate, paymentverify, getPaymentHistory, getAllPaymentsAdmin } = require('../controller/payment.controller.js');
const { isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/paymentcreate', paymentcreate);

router.post('/paymentverify', paymentverify);

router.post('/payHistory', getPaymentHistory);

// Admin endpoint to get all payments
router.get('/admin/all-payments', isAdmin, getAllPaymentsAdmin);

module.exports = router;

