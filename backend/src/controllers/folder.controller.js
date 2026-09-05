const { query } = require("../config/database");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// Create Folder
const createFolder = asyncHandler(async (req, res) => {
  const { name, parentId } = req.body;
  const userId = req.user.id;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Folder name is required");
  }

  const result = await query(
    `INSERT INTO folders (name, owner_id, parent_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
    [name.trim(), userId, parentId || null],
  );

  res.status(201).json({
    success: true,
    message: "Folder created successfully",
    data: {
      folder: result.rows[0],
    },
  });
});

// Get Folders
const getFolders = asyncHandler(async (req, res) => {
  const { parentId } = req.params;
  const userId = req.user.id;

  let result;

  // Root folders
  if (parentId === "null" || parentId === "undefined") {
    result = await query(
      `SELECT *
             FROM folders
             WHERE owner_id = $1
             AND parent_id IS NULL
             AND is_deleted = false
             ORDER BY created_at DESC`,
      [userId],
    );
  }
  // Child folders
  else {
    result = await query(
      `SELECT *
             FROM folders
             WHERE owner_id = $1
             AND parent_id = $2
             AND is_deleted = false
             ORDER BY created_at DESC`,
      [userId, parentId],
    );
  }

  res.json({
    success: true,
    data: {
      folders: result.rows,
    },
  });
});

// Delete Folder
const deleteFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const userId = req.user.id;

  const result = await query(
    `UPDATE folders
         SET is_deleted = true
         WHERE id = $1
         AND owner_id = $2
         RETURNING id`,
    [folderId, userId],
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, "Folder not found");
  }

  res.json({
    success: true,
    message: "Folder deleted",
  });
});

module.exports = {
  createFolder,
  getFolders,
  deleteFolder,
};
