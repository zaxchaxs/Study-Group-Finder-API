import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response";
import { loginUserSchema, registUserSchema, updateUserSchema } from "../schemas/user.schema";
import prisma from "../configs/prismaClient";

export async function validateRegistUser(req: Request, res: Response, next: NextFunction) {
  try {
    const result = registUserSchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json(errorResponse(400, 'Bad Request', JSON.parse(result.error.message), JSON.parse(result.error.message)[0].message));
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

    const hashedPassword = await bcrypt.hash(result.data.password, 10);
    req.body.password = hashedPassword
    next()

  } catch (error) {
    next(error)
  }
}

export async function validateUpdateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const result = updateUserSchema.safeParse(req.body);
    if(!result.success) {
      res.status(400).json(errorResponse(400, 'Bad Request', JSON.parse(result.error.message), JSON.parse(result.error.message)[0].message));      
      return;
    }
    next()

  } catch (error) {
    next(error)
  }
}

export async function validateLoginUser(req: Request, res: Response, next: NextFunction) {
  try {
    const result = loginUserSchema.safeParse(req.body);
    if(!result.success) {
      res.status(400).json(errorResponse(400, 'Bad Request', JSON.parse(result.error.message), JSON.parse(result.error.message)[0].message));      
      return;
    }
    const user = await prisma.user.findUnique({
      where:  {
        email: result.data.email
      }
    })
    
    if(!user) {
      res.status(404).json(errorResponse(404, 'Not Found', 'Email or Password Wrong', "Email or Password Wrong"));      
      return;
    }

    const isValidPassword = await bcrypt.compare(result.data.password, user.password)
    if(!isValidPassword) {
      res.status(401).json(errorResponse(401, 'Unauthorized', "Unauthorized", "Wrong email or password"))
      return;
    }

    next()
  } catch (error) {
    next(error)
  }
}
