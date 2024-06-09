const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2; // Import cloudinary

// Import your Cloudinary configuration function
const { cloudinaryConnect } = require("../config/cloudinary");

// Initialize Cloudinary configuration
cloudinaryConnect();

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } }, //case insensitive
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }); 
  //not including the logged in user
  res.send(users);
});

//@description     Auth/login the user
//@route           POST /api/user/login
//@access          Public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      image: user.image,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  // Check if the username already exists
  const usernameExists = await User.findOne({ name });

  if (usernameExists) {
    res.status(400);
    throw new Error("Username already exists. Please choose another username.");
  }

  // Check if the email already exists
  const emailExists = await User.findOne({ email });

  if (emailExists) {
    res.status(400);
    throw new Error("Email already exists. Please use another email.");
  }

  const user = await User.create({
    name,
    email,
    password, //mongoose mw to encrypt it before saving(creating) this doc in db//pre-save hook MW
    image: name // Assuming image is set to name by default
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});


//@description     Update user's display picture
//@route           POST /api/user/updateDisplayPicture
//@access          Private
const updateDisplayPicture = asyncHandler(async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const email = req.body.email;

    // Directly upload to Cloudinary from buffer
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'profile_pictures' },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });

    const updatedProfile = await User.findOneAndUpdate(
      { email },
      { image: result.secure_url },
      { new: true }
    );

    res.json({
      success: true,
      message: "Profile picture updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = { registerUser, authUser, allUsers, updateDisplayPicture };
