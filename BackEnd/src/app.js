const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const compression = require('compression');
const app = express();
const contactRoutes = require('./routes/contact.routes.js');
const razorpayRoutes = require('./routes/payment.routes.js');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Compression middleware - compress all responses
app.use(compression({ level: 6, threshold: 1024 }));

// Cache control middleware
app.use((req, res, next) => {
  // Static assets - cache for 1 year
  if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|eot|ttf)$/)) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  // HTML - cache for 1 hour
  else if (req.url.endsWith('.html') || req.url === '/') {
    res.set('Cache-Control', 'public, max-age=3600, must-revalidate');
  }
  // API responses - no cache by default
  else {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  next();
});

app.use(morgan('tiny'));

const normalizeOrigin = (origin = '') => origin.trim().replace(/\/+$/, '').toLowerCase();

const defaultFrontendOrigins = [
  'http://localhost:5173',
  'https://aviyuktngo.vercel.app',
  'https://www.aviyuktngo.org',
];

// CORS whitelisted origins from .env + defaults
const envFrontendOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map((u) => u.trim())
  : [];

const allowedOrigins = new Set(
  [...defaultFrontendOrigins, ...envFrontendOrigins]
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean)
);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser or same-origin requests without Origin header.
    if (!origin) return callback(null, true);

    const normalizedIncomingOrigin = normalizeOrigin(origin);

    if (allowedOrigins.has(normalizedIncomingOrigin)) {
      return callback(null, true);
    }

    // Do not throw server errors for disallowed origins.
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(
  cors(corsOptions)
);
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/contact', contactRoutes);
app.use('/razorpay', razorpayRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;
