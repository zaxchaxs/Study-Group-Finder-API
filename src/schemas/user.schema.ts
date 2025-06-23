import { z } from "zod";

export const registUserSchema = z.object({
  username: z.string({ message: "username is required" }).min(5, { message: "Username should be more than 5 character" }).max(191, { message: "username character is too long" }),
  email: z.string({ message: "email is required" }).email({ message: "invalid email format" }).max(191, { message: "email is too long" }),
  password: z.string({ message: "password is required" }).min(6, { message: "password should be at least 6 character" }).max(191, { message: "passwrod is too long" }),
  name: z.string({ message: "name is required" }).min(4).max(191, { message: "name is too long" }),
  avatar: z.string().max(255).optional(),
  role: z.enum(["user", "admin"], { message: "invalid role type" })
});

export const updateUserSchema = z.object({
  username: z.string({ message: "username is required" }).min(5, { message: "Username should be more than 5 character" }).max(191, { message: "username character is too long" }),
  email: z.string({ message: "email is required" }).email({ message: "invalid email format" }).max(191, { message: "email is too long" }),
  name: z.string({ message: "name is required" }).min(4).max(191, { message: "name is too long" }),
  avatar: z.string({message: "Avatar field is required!"}).max(255, {message: "Avatar value contain most 255 character!"}).or(z.null()),
  role: z.enum(["user", "admin"], { message: "invalid role type" })
})

export const loginUserSchema = z.object({
  email: z.string({ message: "email is required" }).email({ message: "invalid email format" }).max(191, { message: "email is too long" }),
  password: z.string({ message: "password is required" }).min(6, { message: "password should be at least 6 character" }).max(191, { message: "passwrod is too long" }),
})

export const verifyUserTokenSchema = z.object({
    token: z.string({
        message: "Token is required!"
    })
});

export const changePasswordSchema = z.object({
  currentPassword: z.string({message: "Current user password is required!"}),
  newPassword: z.string({message: "New user password is required!"}),
});