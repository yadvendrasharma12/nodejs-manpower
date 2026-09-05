
import mongoose from "mongoose";

const assignProjectSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    centerName: {
      type: String,
      trim: true,
      required: true,
    },

    role: {
      type: String,
      enum: ["Proctor", "IT", "Invigilator", "Support staff"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Assign = mongoose.model("Assign", assignProjectSchema);

export default Assign;