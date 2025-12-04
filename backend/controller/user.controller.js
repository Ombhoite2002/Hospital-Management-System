const { validationResult } = require("express-validator");
const userService = require("../services/user.service");

// ===================== REGISTER USER =====================
module.exports.registerUser = async (req, res) => {
  try {
    // 1️⃣ Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    // 2️⃣ Call service
    const { email, password, role } = req.body;
    const user = await userService.createUser({ email, password, role });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role
    },
  token: user.token
});

  } catch (err) {
    console.error("Error in registerUser:", err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};


// ===================== LOGIN USER =====================
module.exports.loginUser = async (req, res) => {
  try {
    // 1️⃣ Validate data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    // 2️⃣ Call service
    const { email, password } = req.body;
    const result = await userService.loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
      token: result.token,
    });

  } catch (err) {
    console.error("Error in loginUser:", err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};


// ===================== LOGOUT =====================
module.exports.logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully. Please delete token on client side.",
  });
};
