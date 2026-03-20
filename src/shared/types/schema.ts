import { z } from "zod";

export const authSchema = z.object({
  login: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Field is required." : "Invalid input.",
    })
    .min(1, { error: "Field is required." })
    .max(20),
  password: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Field is required." : "Invalid input.",
    })
    .min(6, { error: "password shoudn't be too short" })
    .max(50),
});

export type AuthData = z.infer<typeof authSchema>;
