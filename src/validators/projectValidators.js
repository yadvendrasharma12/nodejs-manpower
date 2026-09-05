import { z } from "zod";

export const createProjectSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(1, "Client name is required"),

  clientsName: z
    .string()
    .trim()
    .min(1, "Client's name is required"),

  examName: z
    .string()
    .trim()
    .min(1, "Exam name is required"),

  startExamDate: z.coerce.date({
    message: "Valid start exam date is required",
  }),

  endExamDate: z.coerce.date({
    message: "Valid end exam date is required",
  }),

  totalCenter: z
    .number({
      message: "Total center must be a number",
    })
    .int("Total center must be an integer")
    .positive("Total center must be greater than 0"),

  manpowerCenter: z
    .number({
      message: "Manpower center must be a number",
    })
    .int("Manpower center must be an integer")
    .positive("Manpower center must be greater than 0"),

  typeOfExam: z.enum(["government", "private"], {
    message: "Type of exam must be government or private",
  }),

  examCategory: z.enum(["entrance", "mock", "recruitment"], {
    message: "Exam category must be entrance, mock or recruitment",
  }),

  examMode: z.enum(["ibt", "cbt"], {
    message: "Exam mode must be ibt or cbt",
  }),

  totalCandidate: z
    .number({
      message: "Total candidate must be a number",
    })
    .int("Total candidate must be an integer")
    .positive("Total candidate must be greater than 0"),
});


// UPDATE PROJECT
export const updateProjectSchema = createProjectSchema.partial();




// Uses .partial createProjectSchema = sab fields chahiye.
// UpdateProjectSchema = createProjectSchema.partial() = koi bhi selected fields update kar sakte ho, lekin jo field bhejo uski validation hogi.