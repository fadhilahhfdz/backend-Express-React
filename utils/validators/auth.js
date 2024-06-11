// import express validator
const { body } = require("express-validator");

// import prisma
const prisma = require("../../prisma/client");

// validasi register
const validateRegister = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email is invalid")
    .custom(async (value) => {
      if (!value) {
        throw new Error("Email is required");
      }
      const user = await prisma.user.findUnique({ where: { email: value } });
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

// validasi login
const validateLogin = [
  body("email").notEmpty().withMessage("Email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

module.exports = { validateRegister, validateLogin };
