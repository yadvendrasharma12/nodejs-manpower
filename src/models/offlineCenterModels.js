import mongoose from "mongoose";
import { required } from "zod/mini";

const offlineCenterSchema = new mongoose.Schema(
  {
    examCenter: {
      type: String,
      trim: true,
      required: true,
    },

    city: {
      type: String,
      trim: true,
      required: true,
    },

    examDate: {
      type: Date,
      required: true,
    },

    classRoomPhoto: {
      type: String,
      required: true,
      trim: true,
    },

    entranceGate: {
      type: String,
      required: true,
      trim: true,
    },

    lobbyImages: [
      {
        type: String,
        trim: true,
      },
    ],

  exams: [
  {
    examName: {
      type: String,
      required: true,
      trim: true,
    },

    noOfCandidate: {
      type: Number,
      required: true,
      min: 1,
    },

    allocatedDate: {
      type: Date,
      required: true,
    },
  },
],

  },
  {
    timestamps: true,
  }
);

const Offline = mongoose.model("Offline", offlineCenterSchema);

export default Offline;