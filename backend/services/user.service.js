const { User } = require("../models");

// ======================================================
// USER SERVICE – CREATE USER
// ======================================================
module.exports.createUser = async ({ email, password, role }) => {
  try {
    // 1️⃣ Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error("User already exists with this email");
      error.statusCode = 400;
      throw error;
    }

    // 2️⃣ Create user (password hashing automatically runs via model hook)
    const newUser = await User.create({
      email,
      password,
      role,
    });

    // 3️⃣ Return clean user (no password)
    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };

  } catch (err) {
    // Attach status code if not provided
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};


// ======================================================
// USER SERVICE – LOGIN USER (NEW)
// ======================================================
module.exports.loginUser = async ({ email, password }) => {
  try {
    // 1️⃣ Find user by email
    const user = await User.findOne({ where: { email }, raw: false });
    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 400;
      throw error;
    }

    // 2️⃣ Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 400;
      throw error;
    }

    // 3️⃣ Generate token
    const token = user.generateAuthToken();

    return { user: user.toJSON(), token };

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};

