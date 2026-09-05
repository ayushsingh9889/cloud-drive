const { query } = require("../config/database");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const createPublicLink = asyncHandler(async (req, res) => {
  const { resourceType, resourceId, expiresAt, password } = req.body;
  const userId = req.user.id;

  if (!resourceType || !resourceId) {
    throw new ApiError(400, "resourceType and resourceId required");
  }

  const token = crypto.randomBytes(32).toString("hex");

  let passwordHash = null;
  if (password) {
    passwordHash = await bcrypt.hash(password, 10);
  }

  await query(
    "INSERT INTO link_shares (resource_type, resource_id, token, password_hash, expires_at, created_by) VALUES ($1, $2, $3, $4, $5, $6)",
    [resourceType, resourceId, token, passwordHash, expiresAt || null, userId],
  );

  res.status(201).json({
    success: true,
    message: "Public link created",
    data: {
      token: token,
      url: "http://localhost:5173/share/" + token,
    },
  });
});

const getPublicLinks = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await query(
    "SELECT * FROM link_shares WHERE created_by = $1 ORDER BY created_at DESC",
    [userId],
  );

  res.json({
    success: true,
    data: {
      links: result.rows.map((link) => ({
        ...link,
        url: "http://localhost:5173/share/" + link.token,
      })),
    },
  });
});

const deletePublicLink = asyncHandler(async (req, res) => {
  const linkId = req.params.linkId;
  const userId = req.user.id;

  const result = await query(
    "DELETE FROM link_shares WHERE id = $1 AND created_by = $2 RETURNING id",
    [linkId, userId],
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, "Link not found");
  }

  res.json({ success: true, message: "Link deleted" });
});

module.exports = {
  createPublicLink,
  getPublicLinks,
  deletePublicLink,
};
