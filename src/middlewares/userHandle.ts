import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response";
import { changePasswordSchema, loginUserSchema, registUserSchema, requestFriendSchema, updateFriendRequsetStatusSchema, updateUserSchema, verifyUserTokenSchema } from "../schemas/user.schema";
import prisma from "../configs/prismaClient";
import { memoryUpload } from './multerFileUpload';
import fs from "fs";
import path from "path";

export async function validateRegistUser(req: Request, res: Response, next: NextFunction) {
  memoryUpload([{ name: "avatar", maxCount: 1 }])(req, res, async err => {
    if (err) next(err);

    try {
      const result = registUserSchema.safeParse(req.body)
      if (!result.success) {
        const parsed = JSON.parse(result.error.message)
        res.status(400).json(errorResponse(400, 'Bad Request', parsed, parsed[0]?.message));
        return;
      }

      const duplicateUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: result.data.email },
            { username: result.data.username }]
        }
      })

      if (duplicateUser) {
        res.status(409).json(errorResponse(409, 'Conflict', "Conflict", "Email or Username already taken"))
        return;
      };

      if (req.files && typeof req.files === "object" && "avatar" in req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const file = files["avatar"][0];
        const dir = path.join("public/images/user");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const ext = file.mimetype.split("/")[1] === "jpeg" ? "jpg" : file.mimetype.split("/")[1];
        const filename = `${Date.now()}.${ext}`;
        const fullPath = path.join(dir, filename);

        fs.writeFileSync(fullPath, file.buffer);

        req.body.avatar = path.join("images/user", filename);
      }

      const hashedPassword = await bcrypt.hash(result.data.password, 10);
      req.body.password = hashedPassword

      next()
    } catch (error) {
      next(error)
    }
  })
}

export async function validateUpdateUser(req: Request, res: Response, next: NextFunction) {
  memoryUpload([{ name: "newAvatar", maxCount: 1 }])(req, res, async err => {
    if (err) next(err);

    let newData = {
      ...req.body,
      avatar: req.body.avatar === 'null' ? null : req.body.avatar
    }

    try {
      const result = updateUserSchema.safeParse(newData);
      if (!result.success) {
        const parsed = JSON.parse(result.error.message)
        res.status(400).json(errorResponse(400, 'Bad Request', parsed, parsed[0]?.message));
        return;
      }

      if (req.files && typeof req.files === "object" && "newAvatar" in req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const file = files["newAvatar"][0];
        const dir = path.join("public/images/user");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const ext = file.mimetype.split("/")[1] === "jpeg" ? "jpg" : file.mimetype.split("/")[1];
        const filename = `${Date.now()}.${ext}`;
        const fullPath = path.join(dir, filename);

        fs.writeFileSync(fullPath, file.buffer);

        // delete image lama
        fs.unlink(`public/${newData.avatar}`, (error) => {
          console.error("#irzi ignore this: ", error);
        });

        newData.avatar = path.join("images/user", filename)
      }

      req.body = newData;

      next()
    } catch (error) {
      next(error)
    }
  })
}

export async function validateLoginUser(req: Request, res: Response, next: NextFunction) {
  try {
    const result = loginUserSchema.safeParse(req.body);
    if (!result.success) {
      const parsed = JSON.parse(result.error.message)
      res.status(400).json(errorResponse(400, 'Bad Request', parsed, parsed[0]?.message));
      return;
    }
    const user = await prisma.user.findUnique({
      where: {
        email: result.data.email
      }
    })

    if (!user) {
      res.status(404).json(errorResponse(404, 'Not Found', 'Email or Password Wrong', "Email or Password Wrong"));
      return;
    }

    const isValidPassword = await bcrypt.compare(result.data.password, user.password)
    if (!isValidPassword) {
      res.status(401).json(errorResponse(401, 'Unauthorized', "Unauthorized", "Wrong email or password"))
      return;
    }

    next()
  } catch (error) {
    next(error)
  }
}

export const verifyTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = verifyUserTokenSchema.safeParse(req.body);
    if (!result.success) {
      const parsed = JSON.parse(result.error.message)
      res.status(400).json(errorResponse(400, 'Bad Request', parsed, parsed[0]?.message));
      return;
    }
    next()
  } catch (error) {
    next(error)
  }
}

export const verifyUserChangePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id)

    const result = changePasswordSchema.safeParse(req.body);
    if (!result.success) {
      const parsed = JSON.parse(result.error.message)
      res.status(400).json(errorResponse(400, 'Bad Request', parsed, parsed[0]?.message));
      return;
    }
    
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })

    if (!user) {
      res.status(404).json(errorResponse(404, 'Not Found', 'User not found. Maybe you send wrong user ID!', "User Not Found"));
      return;
    }

    const isValidPassword = await bcrypt.compare(req.body.currentPassword, user.password)
    if (!isValidPassword) {
      res.status(401).json(errorResponse(401, 'Unauthorized', "Unauthorized", "Wrong Password"))
      return;
    };

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    req.body.password = hashedPassword

    next()
  } catch (error) {
    next(error)
  }
};

export const validateRequestFriend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = requestFriendSchema.safeParse(req.body);
    if (!result.success) {
      const parsed = JSON.parse(result.error.message)
      res.status(400).json(errorResponse(400, 'Bad Request', parsed, parsed[0]?.message));
      return;
    };
    next()
    
  } catch (error) {
    next(error)
  }
}

export const validateUpdateStatusFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = updateFriendRequsetStatusSchema.safeParse(req.body);
    if (!result.success) {
      const parsed = JSON.parse(result.error.message)
      res.status(400).json(errorResponse(400, 'Bad Request', parsed, parsed[0]?.message));
      return;
    };
    next()

  } catch (error) {
    next(error)
  }
}