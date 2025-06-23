import { Request, Response } from "express";
import { changeUserPassword, createUser, deleteUser, getAllUser, getUser, loginUser, updateUser } from "../services/user.service";
import { errorResponse, successResponse } from "../utils/response";
import { JWT_REFRESH_SECRET_KEY, JWT_SECRET_KEY } from "../data/envData";
import { generateToken, verifyToken } from "../utils/jwt";
import fs from "fs";


export async function getAllUserHandle(req: Request, res: Response) {
  try {
    const users = await getAllUser();
    res.status(200).json(successResponse(users))

  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage)
    res.status(500).json(
      errorResponse(500, 'Internal Server Error', error, errMessage)
    )
  }
}

export async function getUserHandle(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const numberId = Number(id)
    const result = await getUser(numberId)

    if (result) {
      res.status(200).json(successResponse(result));
      return;
    }

    res.status(404).json(errorResponse(404, 'Not Found', "User Not Found", "Email or Password Wrong!"))

  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage)
    res.status(500).json(
      errorResponse(500, 'Internal Server Error', error, errMessage)
    )
  }
}

export async function postUserHandler(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);

    res.status(200).json(successResponse(user));
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage)
    res.status(500).json(
      errorResponse(500, 'Internal Server Error', error, errMessage)
    )
  }
}

export async function updateUserHandle(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const numberId = Number(id)
    const result = await updateUser(numberId, req.body)
    res.status(200).json(successResponse(result))

  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage)
    res.status(500).json(
      errorResponse(500, 'Internal Server Error', error, errMessage)
    )
  }
}

export async function deleteUserHandle(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const numberId = Number(id)
    const result = await deleteUser(numberId);
    fs.unlink(`public/${result.avatar}`, err => {
      console.error("#irzi ignore this: ", err);
    })
    res.status(200).json(successResponse(result))

  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage)
    res.status(500).json(
      errorResponse(500, 'Internal Server Error', error, errMessage)
    )
  }
}

export async function loginUserHandle(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body);
    if (result) {
      const token = generateToken(result)
      const refreshToken = generateToken(result, "7d", JWT_REFRESH_SECRET_KEY);

      res.status(200).json(successResponse({
        ...result,
        token,
        refreshToken
      }));
      return;
    }

    res.status(404).json(errorResponse(404, 'not found', "Email or Password Wrong", "Email or Password Wrong!"))

  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage)
    res.status(500).json(
      errorResponse(500, 'Internal Server Error', error, errMessage)
    )
  }
}

export const verifyUserTokenHandle = async (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const result = verifyToken(token);
    res.status(200).json(successResponse(result));
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage)
    res.status(500).json(
      errorResponse(500, 'Internal Server Error', error, errMessage)
    )
  }
}

export async function changeUserPasswordHandle(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const result = await changeUserPassword(id, req.body.password);
    res.status(200).json(successResponse(result));
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage)
    res.status(500).json(
      errorResponse(500, 'Internal Server Error', error, errMessage)
    )
  }
}