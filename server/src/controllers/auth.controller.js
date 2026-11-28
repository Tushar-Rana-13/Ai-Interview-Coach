import { registerUser , loginUser } from "../services/auth.service.js";
import { registerSchema } from "../utils/auth.validation.js";
import { loginSchema } from "../utils/auth.validation.js";
import { authCookieOptions } from "../config/cookie.js";

export const register = async (req, res, next) => {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const user = await registerUser(validation.data);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};


export const login = async (req, res, next) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { token, user } = await loginUser(validation.data);

    res.cookie(
      process.env.COOKIE_NAME || "interview_coach_token",
      token,
      authCookieOptions
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    next(error);
  }
};


export const logout = async (req, res) => {
  const cookieName =
    process.env.COOKIE_NAME || "interview_coach_token";

  const { maxAge, ...clearOptions } = authCookieOptions;

  res.clearCookie(cookieName, clearOptions);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};


export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
    },
  });
};
