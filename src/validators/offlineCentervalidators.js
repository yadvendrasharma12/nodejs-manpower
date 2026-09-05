import { z } from "zod";

export const addOfflineSchema = z.object({
  examCenter: z
    .string()
    .trim()
    .min(1, "Exam center is required"),

  city: z
    .string()
    .trim()
    .min(1, "City is required"),

  examDate: z.coerce.date({
    message: "Valid exam date is required",
  }),

  classRoomPhoto: z
    .string()
    .trim()
    .min(1, "Classroom photo is required"),

  entranceGate: z
    .string()
    .trim()
    .min(1, "Entrance gate image is required"),

  lobbyImages: z
    .array(
      z.string().trim().min(1, "Invalid lobby image")
    ).min(1, "At least one lobby image is required"),

  exams: z
    .array(
      z.object({
        examName: z
          .string()
          .trim()
          .min(1, "Exam name is required"),

        noOfCandidate: z
          .number({
            message: "Number of candidates must be a number",
          }).int("Number of candidates must be an integer")
          .positive("Number of candidates must be greater than 0"),

        allocatedDate: z.coerce.date({
          message: "Valid allocated date is required",
        }),
      })
    )
    .min(1, "At least one exam is required"),
});