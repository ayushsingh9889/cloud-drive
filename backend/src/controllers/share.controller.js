const { query } = require("../config/database");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const shareWithUser = asyncHandler(async (req, res) => {
  const { resourceType, resourceId, granteeEmail, role } = req.body;
  const userId = req.user.id;

  if (!resourceType || !resourceId || !granteeEmail || !role) {
    throw new ApiError(400, "All fields required");
  }

  if (resourceType !== "file" && resourceType !== "folder") {
    throw new ApiError(400, "resourceType must be file or folder");
  }

  if (role !== "viewer" && role !== "editor") {
    throw new ApiError(400, "role must be viewer or editor");
  }

  const grantee = await query("SELECT id FROM users WHERE email = $1", [
    granteeEmail.toLowerCase(),
  ]);

  if (grantee.rows.length === 0) {
    throw new ApiError(404, "User not found");
  }

  const granteeId = grantee.rows[0].id;

  if (granteeId === userId) {
    throw new ApiError(400, "You cannot share with yourself");
  }

  const existing = await query(
    `SELECT id
     FROM shares
     WHERE resource_type = $1
     AND resource_id = $2
     AND grantee_user_id = $3`,
    [resourceType, resourceId, granteeId],
  );

  if (existing.rows.length > 0) {
    await query("UPDATE shares SET role = $1 WHERE id = $2", [
      role,
      existing.rows[0].id,
    ]);

    return res.json({
      success: true,
      message: "Share updated",
    });
  }

  await query(
    `INSERT INTO shares
     (resource_type, resource_id, grantee_user_id, role, created_by)
     VALUES ($1, $2, $3, $4, $5)`,
    [resourceType, resourceId, granteeId, role, userId],
  );

  res.status(201).json({
    success: true,
    message: "Shared successfully",
  });
});

const getShares = asyncHandler(async (req, res) => {
  const { resourceType, resourceId } = req.params;

  const result = await query(
    `SELECT
       s.*,
       u.name AS grantee_name,
       u.email AS grantee_email
     FROM shares s
     JOIN users u ON s.grantee_user_id = u.id
     WHERE s.resource_type = $1
     AND s.resource_id = $2`,
    [resourceType, resourceId],
  );

  res.json({
    success: true,
    data: {
      shares: result.rows,
    },
  });
});

const getSharedWithMe = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const filesResult = await query(
    `SELECT
       f.*,
       s.role AS share_role,
       u.name AS owner_name
     FROM shares s
     JOIN files f ON s.resource_id = f.id
     JOIN users u ON f.owner_id = u.id
     WHERE s.grantee_user_id = $1
     AND s.resource_type = $2
     AND f.is_deleted = false`,
    [userId, "file"],
  );

  const foldersResult = await query(
    `SELECT
       fo.*,
       s.role AS share_role,
       u.name AS owner_name
     FROM shares s
     JOIN folders fo ON s.resource_id = fo.id
     JOIN users u ON fo.owner_id = u.id
     WHERE s.grantee_user_id = $1
     AND s.resource_type = $2
     AND fo.is_deleted = false`,
    [userId, "folder"],
  );

  res.json({
    success: true,
    data: {
      files: filesResult.rows,
      folders: foldersResult.rows,
    },
  });
});

const removeShare = asyncHandler(async (req, res) => {
  const shareId = req.params.shareId;
  const userId = req.user.id;

  const result = await query(
    `DELETE FROM shares
     WHERE id = $1
     AND created_by = $2
     RETURNING id`,
    [shareId, userId],
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, "Share not found");
  }

  res.json({
    success: true,
    message: "Share removed",
  });
});

module.exports = {
  shareWithUser,
  getShares,
  getSharedWithMe,
  removeShare,
};
