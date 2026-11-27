
import assert from "node:assert/strict";

import User from "../models/user.model.js";
import Resume from "../models/resume.model.js";
import JobDescription from "../models/jobDescription.model.js";
import Interview from "../models/interview.model.js";
import InterviewReport from "../models/interviewReport.model.js";

const models = [
  User,
  Resume,
  JobDescription,
  Interview,
  InterviewReport,
];

const expectedModels = [
  "User",
  "Resume",
  "JobDescription",
  "Interview",
  "InterviewReport",
];

console.log("\nChecking database models...\n");

// Check model registration
for (const model of models) {
  assert.ok(model.modelName, "Model name is missing");
  assert.ok(model.schema, "Model schema is missing");

  console.log(`✓ ${model.modelName} registered`);
}

// Check expected model names
assert.deepEqual(
  models.map((model) => model.modelName),
  expectedModels
);

// Check important schema fields
const requiredFields = {
  User: ["fullName", "email", "passwordHash"],
  Resume: ["user", "fileName", "parsedData"],
  JobDescription: ["user", "jobTitle", "description"],
  Interview: ["user", "resume", "questions", "status"],
  InterviewReport: ["user", "interview", "scores", "summary"],
};

for (const model of models) {
  for (const field of requiredFields[model.modelName]) {
    const hasField =
      model.schema.path(field) ||
      model.schema.nested?.[field];

    assert.ok(
      hasField,
      `${model.modelName} is missing field: ${field}`
    );
  }

  console.log(`✓ ${model.modelName} schema fields verified`);
}

console.log("\nAll five database models passed verification!\n");
