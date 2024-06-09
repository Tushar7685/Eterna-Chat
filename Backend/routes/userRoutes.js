const express = require("express");
const { registerUser, authUser, allUsers, updateDisplayPicture } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require('../middleware/multerMiddleware.js');

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.post("/updateDisplayPicture", upload.single('file'),updateDisplayPicture)


module.exports = router;