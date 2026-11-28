
import { createInterview , getUserInterviews , getInterviewById , startInterview , completeInterview} from "../services/interview.service.js";

export const createInterviewController = async (req, res, next) => {
  try {
    const { interviewType, difficulty, duration } = req.body;

    // Basic request validation
    if (!["quiz", "interview"].includes(interviewType)) {
      return res.status(400).json({
        success: false,
        message: "Interview type must be quiz or interview.",
      });
    }

    if (
      difficulty &&
      !["easy", "medium", "hard"].includes(difficulty)
    ) {
      return res.status(400).json({
        success: false,
        message: "Difficulty must be easy, medium, or hard.",
      });
    }

    if (
      duration !== undefined &&
      (!Number.isInteger(duration) || duration < 5 || duration > 120)
    ) {
      return res.status(400).json({
        success: false,
        message: "Duration must be an integer between 5 and 120 minutes.",
      });
    }

    const interview = await createInterview(req.user._id, {
      interviewType,
      difficulty,
      duration,
    });

    return res.status(201).json({
      success: true,
      message: "Interview session created successfully.",
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};


export const getUserInterviewsController = async (req, res, next) => {
  try {
    const interviews = await getUserInterviews(req.user._id);

    return res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    });
  } catch (error) {
    next(error);
  }
};


import mongoose from "mongoose";

export const getInterviewByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview ID.",
      });
    }

    const interview = await getInterviewById(id, req.user._id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};


export const startInterviewController = async (req, res, next) => {
  try {
    const interview = await startInterview(
      req.params.id,
      req.user._id
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview started successfully.",
      data: interview,
    });
  } catch (error) {
    if (error.message === "Only pending interviews can be started.") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};


export const completeInterviewController = async (req, res, next) => {
  try {
    const interview = await completeInterview(
      req.params.id,
      req.user._id
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview completed successfully.",
      data: interview,
    });
  } catch (error) {
    if (
      error.message ===
      "Only in-progress interviews can be completed."
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};
