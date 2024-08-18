import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";
import Deliverer from "../models/Deliverer.js";
import Client from "../models/client.js";
import { generateToken } from "../utils/jwt.js";
import { sendEmail, generateResetPasswordEmail } from "../utils/email.js";

// Generate a password reset token
const generatePasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  return resetToken;
};

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      address,
      phone,
      termsAccepted,
      role,
    } = req.body;

    if (!termsAccepted) {
      return res.status(400).json({
        error: "You must accept the terms and conditions to register.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "User with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address,
      phone,
      termsAccepted,
      role,
    });

    await newUser.save();

    if (role === "client") {
      const newClient = new Client({
        user: newUser._id,
        firstName,
        lastName,
        email,
        phone,
      });
      await newClient.save();
    } else if (role === "deliverer") {
      const newDeliverer = new Deliverer({
        user: newUser._id,
        firstName,
        lastName,
        email,
        phone,
      });
      await newDeliverer.save();
    } else {
      return res.status(400).json({
        error: "Invalid role specified.",
      });
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to handle password reset request
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const resetLink = `http://localhost:5001/reset-password?token=${token}`;

    // Save the token and its expiration time to the user
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    const emailContent = generateResetPasswordEmail(user.name, resetLink);
    await sendEmail(user.email, "Password Reset Request", emailContent);

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({
      message: "An error occurred while requesting the password reset.",
    });
  }
};
// Reset password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
