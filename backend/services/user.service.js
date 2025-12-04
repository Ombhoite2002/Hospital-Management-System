const { User } = require("../models");

// ======================================================
// CREATE USER (BUSINESS LOGIC)
// ======================================================
module.exports.createUser = async ({ email, password, role }) => {
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error("User already exists with this email");
      error.statusCode = 400;
      throw error;
    }

    const newUser = await User.create({
      email,
      password,
      role,
    });

    const token = newUser.generateAuthToken();

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      token
    };

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};


// ======================================================
// LOGIN USER (BUSINESS LOGIC)
// ======================================================
module.exports.loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOne({ where: { email }, raw: false });

    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 400;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 400;
      throw error;
    }

    // JWT token
    const token = user.generateAuthToken();

    return {
      user: user.toJSON(),
      token,
    };

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};
