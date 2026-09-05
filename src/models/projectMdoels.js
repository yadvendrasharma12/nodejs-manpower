import mongoose from "mongoose";

const createProjectSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    clientsName: {
      type: String,
      required: true,
      trim: true,
    },

    examName: {
      type: String,
      required: true,
      trim: true,
    },

    startExamDate: {
      type: Date,
      required: true,
    },

    endExamDate: {
      type: Date,
      required: true,
    },

    totalCenter: {
      type: Number,
      required: true,
    },

    manpowerCenter: {
      type: Number,
      required: true,
    },

    typeOfExam: {
      type: String, 
      required: true,
      enum: ["government", "private"],
      lowercase: true,
      trim: true,
    },

    examCategory: {
      type: String,
      required: true,
      enum: ["entrance", "mock", "recruitment"],
      lowercase: true,
      trim: true,
    },

    examMode: {
      type: String,
      required: true,
      enum: ["ibt", "cbt"],
      lowercase: true,
      trim: true,
    },

    totalCandidate: {
      type: Number,
      required: true,
    },
  assignedUsers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
]
  },
  {
    timestamps: true,
  }
);

const Projects = mongoose.model("Projects", createProjectSchema);

export default Projects
