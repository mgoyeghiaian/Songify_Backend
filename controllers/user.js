const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup User
const signup_user = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email already exists");
  }

  // Hash the password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    likedSongs: [], // Initialize likedSongs array
  });

  if (user) {
    const token = generateToken(user._id);
    res.status(201).json({
      _id: user.id,
      email: user.email,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

// Login User
const login_user = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log("User:", user); // Add this line
  console.log("Plain Text Password:", password); // Add this line
  if (user) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = generateToken(user._id);
      res.json({
        _id: user.id,
        email: user.email,
        username: user.username,
        token,
      });
    } else {
      res.status(401);
      throw new Error("Invalid password");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Send Verification Code
const sendVerificationCode = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  // Check if user exists
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Generate verification code
  const verificationCode = generateVerificationCode();

  // Save the verification code to the user
  user.verificationCode = verificationCode;
  await user.save();

  // Send verification code to the user's phone number (implementation depends on your chosen SMS service or library)

  res.json({ message: "Verification code sent successfully" });
});

// Verify Code
const verifyCode = asyncHandler(async (req, res) => {
  const { phoneNumber, code } = req.body;

  // Check if user exists
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if the provided code matches the stored verification code
  if (code !== user.verificationCode) {
    res.status(400);
    throw new Error("Invalid verification code");
  }

  // Update the user's verification status
  user.isVerified = true;
  user.verificationCode = "";
  await user.save();

  res.json({ message: "Verification successful" });
});

// Save Song to User's Liked Songs
const save_song = asyncHandler(async (req, res) => {
  const { songData } = req.body; // Assuming songData is the object containing song information

  // Extract the user ID from the token in the request headers
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  const user = await User.findById(userId);
  user.likedSongs.push(songData); // Save the songData object to the likedSongs array
  await user.save();

  res.status(201).json({ message: "Song saved successfully" });
});

// Delete Song from User's Liked Songs
const delete_song = asyncHandler(async (req, res) => {
  const { songId } = req.params;
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const songIndex = user.likedSongs.findIndex((song) => song.key === songId);

  if (songIndex === -1) {
    res.status(404);
    throw new Error("Song not found in liked songs");
  }

  user.likedSongs.splice(songIndex, 1);

  await user.save();

  res.json({ message: "Song removed from liked songs" });
});

const get_liked_songs = asyncHandler(async (req, res) => {
  // Extract the user ID from the token in the request headers
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  // Find the user by ID and retrieve their likedSongs
  const user = await User.findById(userId).select("likedSongs");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user.likedSongs);
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Generate Verification Code
const generateVerificationCode = () => {
  // Generate a random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
};

module.exports = {
  signup_user,
  login_user,
  sendVerificationCode,
  verifyCode,
  save_song,
  delete_song,
  get_liked_songs,
};
