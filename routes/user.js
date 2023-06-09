const express = require("express");
const router = express.Router();
const {
  login_user,
  signup_user,
  sendVerificationCode,
  verifyCode,
  save_song,
  delete_song,
  get_liked_songs,
} = require("../controllers/user");

// User Routes
router.post("/signup", signup_user);
router.post("/login", login_user);
router.post("/send-verification-code", sendVerificationCode);
router.post("/verify-code", verifyCode);
router.get("/liked-songs", get_liked_songs);
router.post("/save-song", save_song);
router.delete("/delete-song/:songId", delete_song);

module.exports = router;
