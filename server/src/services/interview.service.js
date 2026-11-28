
import Interview from "../models/interview.model.js";

export const createInterview = async (userId, interviewData) => {
  const {
    interviewType,
    difficulty,
    duration,
  } = interviewData;

  const interview = await Interview.create({
    user: userId,
    interviewType,
    difficulty: difficulty || "medium",
    duration: duration || 30,
  });

  return interview;
};


export const getUserInterviews = async (userId) => {
  const interviews = await Interview.find({
    user: userId,
  }).sort({ createdAt: -1 });

  return interviews;
};


export const getInterviewById = async (interviewId, userId) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  });

  return interview;
};


export const startInterview = async (interviewId, userId) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  });

  if (!interview) {
    return null;
  }

  if (interview.status !== "pending") {
    throw new Error("Only pending interviews can be started.");
  }

  interview.status = "in-progress";
  interview.startedAt = new Date();

  await interview.save();

  return interview;
};


export const completeInterview = async (interviewId, userId) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  });

  if (!interview) {
    return null;
  }

  if (interview.status !== "in-progress") {
    throw new Error(
      "Only in-progress interviews can be completed."
    );
  }

  interview.status = "completed";
  interview.completedAt = new Date();

  await interview.save();

  return interview;
};
