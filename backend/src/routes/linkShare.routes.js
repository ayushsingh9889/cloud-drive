const express = require("express");
const {
  createPublicLink,
  getPublicLinks,
  deletePublicLink,
} = require("../controllers/linkShare.controller");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createPublicLink);
router.get("/", getPublicLinks);
router.delete("/:linkId", deletePublicLink);

module.exports = router;
