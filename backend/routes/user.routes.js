const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controller/user.controller");

// ----------------------------------------------------
// USER REGISTER ROUTE
// ----------------------------------------------------
router.post(
  "/register",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email is required"),

    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    body("role")
      .optional()
      .isIn([
        "admin",
        "doctor",
        "nurse",
        "receptionist",
        "pharmacist",
        "lab_tech",
        "accountant",
      ])
      .withMessage("Invalid role selected"),
  ],
  userController.registerUser
);

// ----------------------------------------------------
// USER LOGIN ROUTE  (NEW)
// ----------------------------------------------------
router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email is required"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required"),
  ],
  userController.loginUser   // NEW CONTROLLER FUNCTION
);

module.exports = router;
