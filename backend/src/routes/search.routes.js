const express = require('express');
const { searchItems } = require('../controllers/search.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
router.get('/', searchItems);

module.exports = router;
