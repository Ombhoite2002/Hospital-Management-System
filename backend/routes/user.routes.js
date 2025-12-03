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

module.exports = router;
