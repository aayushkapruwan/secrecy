import { string, z } from "zod"
export const userNameValidation = z.string()
    .min(5, "userName must be atleast of 2 characters")
    .max(20, "userName can be of atmost 20 characters")
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{2,15}$/, "userName must not contain special characters")
export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.email({ message: "invalid emailaddress" }),
    password: z.string().min(6, "password must be of atleast 6 characters")
})    