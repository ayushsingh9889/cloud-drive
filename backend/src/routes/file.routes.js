const express = require('express');
const {
    upload,
    uploadFile,
    getFiles,
    getRecentFiles,
    getTrashFiles,
    downloadFile,
    deleteFile,
    restoreFile
} = require('../controllers/file.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/upload', upload.single('file'), uploadFile);
router.get('/recent', getRecentFiles);
router.get('/trash', getTrashFiles);
router.get('/folder/:folderId', getFiles);
router.get('/:fileId/download', downloadFile);
router.delete('/:fileId', deleteFile);
router.post('/:fileId/restore', restoreFile);

module.exports = router;
