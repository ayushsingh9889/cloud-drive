const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../config/database");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    throw new ApiError(400, "Please provide name, email and password");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  // Check if user exists
  const existingUser = await query("SELECT id FROM users WHERE email = $1", [
    email.toLowerCase(),
  ]);

  if (existingUser.rows.length > 0) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const result = await query(
    `INSERT INTO users (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, created_at`,
    [name, email.toLowerCase(), passwordHash],
  );

  const user = result.rows[0];

  // Create root folder for user
  await query(
    `INSERT INTO folders (name, owner_id)
         VALUES ('My Drive', $1)`,
    [user.id],
  );

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || "1d" },
  );

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  // Find user
  const result = await query("SELECT * FROM users WHERE email = $1", [
    email.toLowerCase(),
  ]);

  if (result.rows.length === 0) {
    throw new ApiError(401, "Invalid email or password");
  }

  const user = result.rows[0];

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || "1d" },
  );

  // Log activity
  await query(
    `INSERT INTO activities (actor_id, action, resource_type, resource_id, context)
         VALUES ($1, 'login', 'user', $1, $2)`,
    [user.id, JSON.stringify({ action: "User logged in" })],
  );

  res.json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    },
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const result = await query(
    "SELECT id, name, email, created_at FROM users WHERE id = $1",
    [req.user.id],
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, "User not found");
  }

  res.json({
    success: true,
    data: {
      user: result.rows[0],
    },
  });
});

module.exports = { register, login, getMe };
