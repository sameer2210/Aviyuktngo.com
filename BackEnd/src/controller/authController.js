const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const userModel = require('../models/user.model');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SEC;
const TOKEN_COOKIE_NAME = 'token';
const TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days
const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax',
    maxAge: TOKEN_EXPIRY * 1000,
  };
};

const getCookieClearOptions = () => {
  const { maxAge, ...cookieOptions } = getCookieOptions();
  return cookieOptions;
};

const getPublicUser = user => ({
  id: user._id,
  name: user.name,
  email: user.email,
  profilePic: user.profilePic || '',
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const signToken = userId => {
  if (!JWT_SECRET) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: `${TOKEN_EXPIRY}s` });
};

exports.googleAuth = async (req, res) => {
  const googleToken = req.body?.token || req.body?.credential || req.body?.idToken;

  if (!googleToken) {
    return res.status(400).json({ message: 'Google token is required' });
  }

  if (!GOOGLE_CLIENT_ID) {
    return res.status(500).json({ message: 'GOOGLE_CLIENT_ID is not configured' });
  }

  try {
    const ticket = await oauthClient.verifyIdToken({
      idToken: googleToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload?.sub;
    const email = payload?.email?.toLowerCase();
    const name = payload?.name || 'Aviyukt User';
    const profilePic = payload?.picture || '';
    const emailVerified = payload?.email_verified;

    if (!googleId || !email) {
      return res.status(400).json({ message: 'Invalid Google account data' });
    }

    if (!emailVerified) {
      return res.status(401).json({ message: 'Google email is not verified' });
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        name,
        email,
        profilePic,
        googleId,
      });
    } else {
      // Keep existing users compatible while moving to Google-only auth.
      user.name = user.name || user.fullname || name;
      user.profilePic = profilePic || user.profilePic || '';
      user.googleId = user.googleId || googleId;
      await user.save();
    }

    const token = signToken(user._id);
    res.cookie(TOKEN_COOKIE_NAME, token, getCookieOptions());

    return res.status(200).json({
      user: getPublicUser(user),
      token,
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(401).json({ message: 'Google authentication failed' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select('_id name email profilePic role status createdAt updatedAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user: getPublicUser(user) });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie(TOKEN_COOKIE_NAME, getCookieClearOptions());
  return res.status(200).json({ message: 'Logged out successfully' });
};

exports.getGoogleClientId = (req, res) => {
  if (!GOOGLE_CLIENT_ID) {
    return res.status(500).json({ message: 'GOOGLE_CLIENT_ID is not configured' });
  }

  return res.status(200).json({ clientId: GOOGLE_CLIENT_ID });
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel
      .find()
      .select('_id name email profilePic createdAt updatedAt')
      .sort({ createdAt: -1 });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};
