const express = require('express');
const { starItem, getStarredItems } = require('../controllers/star.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', starItem);
router.get('/items', getStarredItems);

module.exports = router;
