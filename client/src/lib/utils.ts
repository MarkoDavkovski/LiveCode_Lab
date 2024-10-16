import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authFormSchema = (type: string) => {
  const commonSchema = z.object({
    username: z
      .string()
      .min(2, "Username must be at least 2 characters.")
      .max(50, "Username must be at most 50 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(100, "Password must be at most 100 characters"),
  });

  if (type === "sign-up")
    return commonSchema
      .extend({
        confirmPassword: z
          .string()
          .min(8, "Password must be at least 8 characters.")
          .max(100, "Password must be at most 100 characters"),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });

  return commonSchema;
};
