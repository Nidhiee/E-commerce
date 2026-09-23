const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const REFRESH_COOKIE_NAME = 'refreshToken';

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL
  });
};

const generateRawRefreshToken = () => crypto.randomBytes(64).toString('hex');

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

// Creates a new RefreshToken document and returns the raw (unhashed) token
// to send to the client. Only the hash is ever persisted.
const issueRefreshToken = async (userId) => {
  const rawToken = generateRawRefreshToken();
  await RefreshToken.create({
    user: userId,
    tokenHash: hashToken(rawToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
  });
  return rawToken;
};

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: REFRESH_TOKEN_TTL_MS
});

module.exports = {
  REFRESH_COOKIE_NAME,
  generateAccessToken,
  generateRawRefreshToken,
  hashToken,
  issueRefreshToken,
  getRefreshCookieOptions
};
