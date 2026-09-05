const { query } = require("../config/database");
const { supabase, bucketName } = require("../config/supabase");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const multer = require("multer");
const { logActivity } = require("./activity.controller");

const upload = multer({
  storage: multer.memoryStorage(),
});

// ==================== UPLOAD FILE ====================

const uploadFile = asyncHandler(async (req, res) => {
  const file = req.file;
  const userId = req.user.id;

  if (!file) {
    throw new ApiError(400, "No file uploaded");
  }

  const timestamp = Date.now();

  const storageKey = userId + "/" + timestamp + "-" + file.originalname;

  // Upload to Supabase Storage
  const { error: storageError } = await supabase.storage
    .from(bucketName)
    .upload(storageKey, file.buffer, {
      contentType: file.mimetype,
    });

  if (storageError) {
    console.error("Storage error:", storageError.message);
    throw new ApiError(500, "File upload to storage failed");
  }

  // Save file information in database
  const result = await query(
    `INSERT INTO files
     (name, mime_type, size_bytes, storage_key, owner_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [file.originalname, file.mimetype, file.size, storageKey, userId],
  );

  const uploadedFile = result.rows[0];

  // Activity log
  await logActivity(userId, "upload", "file", uploadedFile.id, {
    fileName: file.originalname,
  });

  res.status(201).json({
    success: true,
    message: "File uploaded successfully",
    data: {
      file: uploadedFile,
    },
  });
});

// ==================== GET FILES ====================

const getFiles = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await query(
    `SELECT *
     FROM files
     WHERE owner_id = $1
     AND is_deleted = false
     ORDER BY created_at DESC`,
    [userId],
  );

  res.json({
    success: true,
    data: {
      files: result.rows,
    },
  });
});

// ==================== GET RECENT FILES ====================

const getRecentFiles = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await query(
    `SELECT *
     FROM files
     WHERE owner_id = $1
     AND is_deleted = false
     ORDER BY created_at DESC
     LIMIT 20`,
    [userId],
  );

  res.json({
    success: true,
    data: {
      files: result.rows,
    },
  });
});

// ==================== GET TRASH FILES ====================

const getTrashFiles = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await query(
    `SELECT *
     FROM files
     WHERE owner_id = $1
     AND is_deleted = true
     ORDER BY updated_at DESC`,
    [userId],
  );

  res.json({
    success: true,
    data: {
      files: result.rows,
    },
  });
});

// ==================== DOWNLOAD FILE ====================

const downloadFile = asyncHandler(async (req, res) => {
  const fileId = req.params.fileId;
  const userId = req.user.id;

  const result = await query(
    `SELECT *
     FROM files
     WHERE id = $1
     AND owner_id = $2
     AND is_deleted = false`,
    [fileId, userId],
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, "File not found");
  }

  const file = result.rows[0];

  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(file.storage_key, 60);

  if (error) {
    console.error("Download error:", error.message);
    throw new ApiError(500, "Download failed");
  }

  res.json({
    success: true,
    data: {
      downloadUrl: data.signedUrl,
    },
  });
});

// ==================== DELETE FILE ====================

const deleteFile = asyncHandler(async (req, res) => {
  const fileId = req.params.fileId;
  const userId = req.user.id;

  // Get file first so we can use its name in activity log
  const fileResult = await query(
    `SELECT *
     FROM files
     WHERE id = $1
     AND owner_id = $2`,
    [fileId, userId],
  );

  if (fileResult.rows.length === 0) {
    throw new ApiError(404, "File not found");
  }

  const file = fileResult.rows[0];

  // Move file to trash
  const result = await query(
    `UPDATE files
     SET is_deleted = true,
         updated_at = NOW()
     WHERE id = $1
     AND owner_id = $2
     RETURNING id`,
    [fileId, userId],
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, "File not found");
  }

  // Activity log
  await logActivity(userId, "delete", "file", fileId, {
    fileName: file.name,
  });

  res.json({
    success: true,
    message: "File moved to trash",
  });
});

// ==================== RESTORE FILE ====================

const restoreFile = asyncHandler(async (req, res) => {
  const fileId = req.params.fileId;
  const userId = req.user.id;

  // Get file first for activity log
  const fileResult = await query(
    `SELECT *
     FROM files
     WHERE id = $1
     AND owner_id = $2`,
    [fileId, userId],
  );

  if (fileResult.rows.length === 0) {
    throw new ApiError(404, "File not found");
  }

  // Restore file
  const result = await query(
    `UPDATE files
     SET is_deleted = false,
         updated_at = NOW()
     WHERE id = $1
     AND owner_id = $2
     RETURNING id`,
    [fileId, userId],
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, "File not found");
  }

  // Activity log
  await logActivity(userId, "restore", "file", fileId, {});

  res.json({
    success: true,
    message: "File restored",
  });
});

// ==================== EXPORTS ====================

module.exports = {
  upload,
  uploadFile,
  getFiles,
  getRecentFiles,
  getTrashFiles,
  downloadFile,
  deleteFile,
  restoreFile,
};
