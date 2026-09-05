const express = require('express');
const {
    shareWithUser,
    getShares,
    getSharedWithMe,
    removeShare
} = require('../controllers/share.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', shareWithUser);
router.get('/shared-with-me', getSharedWithMe);
router.get('/:resourceType/:resourceId', getShares);
router.delete('/:shareId', removeShare);

module.exports = router;
