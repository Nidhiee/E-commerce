const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const {
  REFRESH_COOKIE_NAME,
  generateAccessToken,
  issueRefreshToken,
  hashToken,
  getRefreshCookieOptions
} = require('../utils/tokens');

// Issues an access token in the JSON body and a refresh token as an
// httpOnly cookie, then sends the user profile response.
const sendAuthResponse = async (res, statusCode, user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = await issueRefreshToken(user._id);

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());

  res.status(statusCode).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    accessToken
  });
};

// @desc Register new user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  console.log(`[auth/register] attempt email=${email} name=${name}`);

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log(`[auth/register] rejected: email already exists id=${userExists._id}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // role is never taken from the request body - every new signup is a customer
    const user = await User.create({ name, email, password });
    console.log(`[auth/register] created user id=${user._id} role=${user.role}`);

    await sendAuthResponse(res, 201, user);
  } catch (error) {
    console.error(`[auth/register] error:`, error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log(`[auth/login] attempt email=${email}`);

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      console.log(`[auth/login] success id=${user._id} role=${user.role}`);
      await sendAuthResponse(res, 200, user);
    } else {
      console.log(`[auth/login] failed: invalid credentials for email=${email}`);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(`[auth/login] error:`, error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc Rotate a refresh token for a new access token + refresh token
// @route POST /api/auth/refresh
const refresh = async (req, res) => {
  const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];

  if (!rawToken) {
    return res.status(401).json({ message: 'Not authorized, no refresh token' });
  }

  try {
    const tokenHash = hashToken(rawToken);
    const stored = await RefreshToken.findOne({ tokenHash });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      res.clearCookie(REFRESH_COOKIE_NAME, getRefreshCookieOptions());
      return res.status(401).json({ message: 'Not authorized, refresh token invalid' });
    }

    const user = await User.findById(stored.user);
    if (!user) {
      res.clearCookie(REFRESH_COOKIE_NAME, getRefreshCookieOptions());
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Rotate: revoke the used token so it can't be replayed, then issue a new pair
    stored.revokedAt = new Date();
    await stored.save();

    await sendAuthResponse(res, 200, user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Revoke the current refresh token and clear the cookie
// @route POST /api/auth/logout
const logout = async (req, res) => {
  const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];

  try {
    if (rawToken) {
      const tokenHash = hashToken(rawToken);
      await RefreshToken.updateOne(
        { tokenHash, revokedAt: null },
        { revokedAt: new Date() }
      );
    }

    res.clearCookie(REFRESH_COOKIE_NAME, getRefreshCookieOptions());
    res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get the logged-in user's profile
// @route GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
};

module.exports = { registerUser, loginUser, refresh, logout, getMe };
