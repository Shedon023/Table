import { z } from "zod";

export const userSchema = z
  .object({
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    maidenName: z.string().optional(),
    age: z.number().min(0, "Must be positive").optional(),
    gender: z.enum(["male", "female"]).optional(),
    username: z.string().min(1, "Required"),
    password: z.string().min(6, "Min 6 chars"),
    birthDate: z.string().optional(),
  })
  .refine((data) => data.username.toLowerCase().includes(data.firstName.toLowerCase()), {
    path: ["username"],
    message: "Username must contain first name",
  });

export type UserFormValues = z.infer<typeof userSchema>;
