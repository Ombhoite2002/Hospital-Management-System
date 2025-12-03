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
