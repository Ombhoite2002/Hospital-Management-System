const { validationResult } = require("express-validator");
const { User } = require("../models");

// ===================== REGISTER USER =====================
module.exports.registerUser = async (req, res) => {
  try {
    // Validate request fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create new user (password auto-hashed by hooks)
    const newUser = await User.create({
      email,
      password,
      role,
    });

    // Generate token using model method
    const token = newUser.generateAuthToken();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,  // password already removed because of toJSON()
      token,
    });

  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
