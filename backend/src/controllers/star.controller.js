const { query } = require("../config/database");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const starItem = asyncHandler(async (req, res) => {
  const { resourceType, resourceId } = req.body;
  const userId = req.user.id;

  if (!resourceType || !resourceId) {
    throw new ApiError(400, "resourceType and resourceId required");
  }

  // Check if already starred
  const existing = await query(
    `SELECT *
         FROM stars
         WHERE user_id = $1
         AND resource_type = $2
         AND resource_id = $3`,
    [userId, resourceType, resourceId],
  );

  // If already starred -> remove star
  if (existing.rows.length > 0) {
    await query(
      `DELETE FROM stars
             WHERE user_id = $1
             AND resource_type = $2
             AND resource_id = $3`,
      [userId, resourceType, resourceId],
    );

    return res.json({
      success: true,
      starred: false,
      message: "Removed from starred",
    });
  }

  // Otherwise -> add star
  await query(
    `INSERT INTO stars
         (user_id, resource_type, resource_id)
         VALUES ($1, $2, $3)`,
    [userId, resourceType, resourceId],
  );

  res.json({
    success: true,
    starred: true,
    message: "Added to starred",
  });
});

const getStarredItems = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get starred files
  const filesResult = await query(
    `SELECT f.*
         FROM stars s
         JOIN files f ON s.resource_id = f.id
         WHERE s.user_id = $1
         AND s.resource_type = $2
         AND f.is_deleted = false`,
    [userId, "file"],
  );

  // Get starred folders
  const foldersResult = await query(
    `SELECT fo.*
         FROM stars s
         JOIN folders fo ON s.resource_id = fo.id
         WHERE s.user_id = $1
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

module.exports = {
  starItem,
  getStarredItems,
};
