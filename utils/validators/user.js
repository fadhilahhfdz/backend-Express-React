// import express validator
const { body } = require("express-validator");

// import prisma
const prisma = require("../../prisma/client");

// validasi create user
const validateUser = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email is invalid")
    .custom(async (value, { req }) => {
      if (!value) {
        throw new Error("Email is required");
      }
      const user = await prisma.user.findUnique({ where: { email: value } });
      if (user && user.id !== Number(req.params.id)) {
        return true;
      }
    }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

module.exports = { validateUser };
