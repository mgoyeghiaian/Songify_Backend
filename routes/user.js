const express = require("express");
const router = express.Router();
const { login_user, signup_user, save_song, delete_song, get_liked_songs } = require("../controllers/user");
// const { protect } = require("../middleware/user");
// const passport = require('passport');

// Google Login
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), login_user);

// Facebook Login
// router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
// router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), login_user);

// User Routes
router.post("/signup", signup_user);
router.post("/login", login_user);
router.get('/liked-songs', get_liked_songs);
router.post("/save-song", save_song);
router.delete("/delete-song/:songId", delete_song);

module.exports = router;
