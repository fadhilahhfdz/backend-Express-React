//import express
const express = require("express");

//import prisma client
const prisma = require("../prisma/client");

// import validationResult from express-validator
const { validationResult } = require("express-validator");

// import bcrypt
const bcrypt = require("bcryptjs");

// function findUSers
const findUSers = async (req, res) => {
  try {
    // get all user from database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    // send response
    res.status(200).send({
      success: true,
      message: "Get all user successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

// function createUser
const createUser = async (req, res) => {
  // periksa hasil validasi
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // jika ada error, kembalikan error ke pengguna
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    // insert data
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      },
    });

    res.status(201).send({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

// function findUserById
const findUserById = async (req, res) => {
  // get Id from params
  const { id } = req.params;

  try {
    // get user by Id
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // send response
    res.status(200).send({
      success: true,
      message: `Get user by Id :${id}`,
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

// function updateUser

const updateUser = async (req, res) => {
  // get Id from params
  const { id } = req.params;

  // periksa hasil validasi
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // jika ada error, kembalikan error ke pengguna
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    // update user
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      },
    });

    // send response
    res.status(200).send({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

// function deleteUser
const deleteUser = async (req, res) => {
  // get Id from params
  const { id } = req.params;

  try {
    // delete user
    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    // send response
    res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { findUSers, createUser, findUserById, updateUser, deleteUser };
