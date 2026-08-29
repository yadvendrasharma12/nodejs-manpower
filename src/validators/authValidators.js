import { z } from "zod";


export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),

  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),

  gender: z.enum(["Male", "Female", "Other"], {
    error: "Gender must be Male, Female or Other",
  }),

  dateOfBirth: z.coerce.date({
    error: "Invalid date of birth",
  }),
});

