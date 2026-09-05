import { z } from "zod";

export const assignProjectSchema = z.object({
  projectId: z
    .string()
    .trim()
    .min(1, "Project ID is required"),

  userId: z
    .string()
    .trim()
    .min(1, "User ID is required"),

  centerName: z
    .string()
    .trim()
    .min(1, "Center name is required"),

  role: z.enum(
    ["Proctor", "IT", "Invigilator", "Support staff"],
    {
      message: "Invalid role",
    }
  ),
});