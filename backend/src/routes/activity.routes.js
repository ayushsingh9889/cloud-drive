const express = require("express");
const { getActivities } = require("../controllers/activity.controller");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);
router.get("/", getActivities);

module.exports = router;
