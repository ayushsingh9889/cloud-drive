const express = require('express');
const {
    createFolder,
    getFolders,
    deleteFolder
} = require('../controllers/folder.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createFolder);
router.get('/parent/:parentId', getFolders);
router.delete('/:folderId', deleteFolder);

module.exports = router;
