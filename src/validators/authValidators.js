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

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional(),

  name: z
    .string()
    .trim()
    .min(2, "Invalid name")
    .optional(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
}).refine(
  (data) => data.email || data.name,
  {
    message: "Email or name is required",
    path: ["email"],
  }
);

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Invalid email")
    .optional(),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number")
    .optional(),

  gender: z
    .enum(["Male", "Female", "Other"], {
      error: "Gender must be Male, Female or Other",
    })
    .optional(),

  dateOfBirth: z
    .coerce
    .date({
      error: "Invalid date of birth",
    })
    .optional(),
});



export const forgetemailSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email"),
});

export const ForgetOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email"),

  otp: z
    .string()
    .trim()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});


export const ResetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});