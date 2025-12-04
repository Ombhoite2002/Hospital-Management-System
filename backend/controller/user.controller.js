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


// ===================== LOGIN USER (NEW) =====================
module.exports.loginUser = async (req, res) => {
  try {
    // 1️⃣ Validate Email/Password
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // 2️⃣ Check if user exists
    const user = await User.findOne({ where: { email }, raw: false }); 
    // raw:false → required to access instance methods comparePassword()

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3️⃣ Compare hashed password with entered password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4️⃣ Generate JWT Token
    const token = user.generateAuthToken();

    // 5️⃣ Return user details (password removed automatically)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: user.toJSON(),
      token,
    });

  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ===================== LOGOUT USER =====================
module.exports.logoutUser = async (req, res) => {
  try {
    // No server-side token deletion needed (JWT is stateless)
    return res.status(200).json({
      success: true,
      message: "Logged out successfully. Please delete token on client side."
    });

  } catch (error) {
    console.error("Error in logoutUser:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

