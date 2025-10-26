import { z } from "zod";

// Personal Info Update Schema
export const personalUpdateSchema = z.object({
  firstname: z.string().min(2).optional(),
  lastname: z.string().min(2).optional(),
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  contact: z.string().min(10).optional(),
  countryCode: z.string().min(1).optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  dob: z.string().optional(),
});

// Address Update Schema
export const addressUpdateSchema = z.object({
  address_line_1: z.string().min(1).optional(),
  address_line_2: z.string().optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  zip_code: z.string().min(5).optional(),
  country: z.string().min(1).optional(),
});

// Password Reset Schema
export const passwordResetSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

// Profile Picture Update Schema
export const profilePictureSchema = z.object({
  profilePicture: z.string().url(),
});

// Types
export type PersonalUpdate = z.infer<typeof personalUpdateSchema>;
export type AddressUpdate = z.infer<typeof addressUpdateSchema>;
export type PasswordReset = z.infer<typeof passwordResetSchema>;
export type ProfilePictureUpdate = z.infer<typeof profilePictureSchema>;