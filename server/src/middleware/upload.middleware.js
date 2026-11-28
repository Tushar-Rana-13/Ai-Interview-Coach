
import multer from "multer";
import path from "path";

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();

  const isValidExtension = [".pdf", ".docx"].includes(extension);
  const isValidMimeType = allowedMimeTypes.includes(file.mimetype);

  if (!isValidExtension || !isValidMimeType) {
    return callback(
      new Error("Only PDF and DOCX files are allowed.")
    );
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

export const uploadResume = upload.single("resume");
