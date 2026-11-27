
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const registerUser = async ({
  fullName,
  email,
  password,
}) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  if (Buffer.byteLength(password, "utf8") > 72) {
    const error = new Error(
      "Password must not exceed 72 UTF-8 bytes"
    );
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await User.create({
      fullName,
      email,
      passwordHash,
    });

    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError = new Error(
        "Email is already registered"
      );
      duplicateError.statusCode = 409;
      throw duplicateError;
    }

    throw error;
  }
};
