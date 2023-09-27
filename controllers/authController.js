const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

//orders
exports.getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user.id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "couldnt update profile",
      success: false,
      error,
    });
  }
};
//update profile

exports.updateProfileController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const user = await userModel.findByIdAndUpdate(req.user._id);
    //password
    if (password && password.length < 4) {
      return res.json({ error: "password is required and 4 character min" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        email: email || user.email,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      message: "update profile success",
      success: true,
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "couldnt update profile",
      success: false,
      error,
    });
  }
};

//create user register user
exports.registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //validation
    if (!name || !email || !password || !phone || !address || !answer) {
      return res.status(400).send({
        success: false,
        message: "PLEASE FILL ALL DETAILS",
      });
    }
    //existing usercase
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(401).send({
        success: false,
        message: "USER ALREADY EXISTS",
      });
    }
    // const hashedPassword = await hashPassword(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    //SAVE NEW USER
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    });
    await user.save();
    return res.status(201).send({
      success: true,
      message: "USER CREATED SUCCESSFULLY",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "error in register callback",
      success: false,
      error,
    });
  }
};
//get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).send({
      userCount: users.length,
      success: true,
      message: "USER CREATED SUCCESSFULLY",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "error in getting all users",
      success: false,
      error,
    });
  }
};
//login
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        adddress: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forogt password
exports.forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "reqd is email" });
    }
    if (!answer) {
      res.status(400).send({ message: "reqd is answer" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "reqd is newPassword" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "wrong email or answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    return res.status(200).send({
      success: false,
      message: "password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in forogtpoassword",
      error,
    });
  }
};

//test controller
exports.testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};
