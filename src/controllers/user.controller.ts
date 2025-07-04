import { Request, Response } from "express";
import { changeUserPassword, createUser, deleteUser, getAllUser, getUser, loginUser, updateUser, getUserByUsn, getUserFriends, requestFriend, AcceptRequestFriend, deleteRequestFriend } from "../services/user.service";
import { errorResponse, successResponse } from "../utils/response";
import { JWT_REFRESH_SECRET_KEY, JWT_SECRET_KEY } from "../data/envData";
import { generateToken, verifyToken } from "../utils/jwt";
import fs from "fs";
import { FriendStatusEnum } from "../types/user";
import { Prisma } from "@prisma/client";
import { getAllInterest } from "../services/interest.service";
import { UserFriendDataType } from "../types/user-friend";

export async function getAllUserHandle(req: Request, res: Response) {
  try {
    const host = `${req.protocol}://${req.get("host")}`
    const { name, interest } = req.query;
    let whereClause: Prisma.UserWhereInput = {};

    if (name && typeof name === 'string') {
      whereClause = {
        OR: [
          {
            username: {
              contains: name
            }
          },
          {
            name: {
              contains: name
            }
          }
        ]
      }
    };
    
    let interests: {id: number; name: string}[] = [];
    if(interest && typeof interest === "string") {
      const interestName = interest.split(",").filter(name => name.length > 0);
      interests = await getAllInterest({
        name: {
          in: interestName
        }
      });
    };

    if(interests.length > 0) {
      const interestsId = interests.map(el => el.id);
      whereClause = {
        ...whereClause,
        userInterests: {
          some: {
            interestId: {
              in: interestsId
            }
          }
        }
      }
    };


    const users = await getAllUser(whereClause);
    users.forEach(user => {
      if (user.avatar) {
        user.avatar = `${host}/${user.avatar}`
      }
    })
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
    const host = `${req.protocol}://${req.get("host")}`
    const { id } = req.params;
    const numberId = Number(id)
    const result = await getUser({
      id: numberId
    })

    if (result) {
      if (result.avatar) {
        result.avatar = `${host}/${result.avatar}`
      }
      res.status(200).json(successResponse(result));
      return;
    }

    res.status(404).json(errorResponse(404, 'Not Found', "User Not Found", "Id Wrong!"))

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
    const host = `${req.protocol}://${req.get("host")}`
    const user = await createUser(req.body);
    if (user.avatar) {
      user.avatar = `${host}/${user.avatar}`
    }

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
    const host = `${req.protocol}://${req.get("host")}`
    const { id } = req.params;
    const numberId = Number(id)
    const result = await updateUser(numberId, req.body)
    if (result.avatar) {
      result.avatar = `${host}/${result.avatar}`;
    };
    const token = generateToken(result)
    const refreshToken = generateToken(result, "30d", JWT_REFRESH_SECRET_KEY);
    res.status(200).json(successResponse({
      ...result,
      token,
      refreshToken
    }))

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
    const host = `${req.protocol}://${req.get("host")}`
    const result = await loginUser(req.body);
    if (result) {
      const token = generateToken(result)
      const refreshToken = generateToken(result, "7d", JWT_REFRESH_SECRET_KEY);
      if (result.avatar) {
        result.avatar = `${host}/${result.avatar}`;
      }

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

export async function getUserByUsnHandle(req: Request, res: Response) {
  try {
    const host = `${req.protocol}://${req.get("host")}`
    const { username } = req.params;
    const result = await getUserByUsn(username);

    if (result) {
      result.avatar = `${host}/${result.avatar}`
      res.status(200).json(successResponse(result));
      return;
    }

    res.status(404).json(errorResponse(404, 'Not Found', "User Not Found", "Username Wrong!"))

  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage)
    res.status(500).json(
      errorResponse(500, 'Internal Server Error', error, errMessage)
    )
  }
}

// ## user Friendship handle
export async function getUserFriendsHandle(req: Request, res: Response) {
  try {

    let { byUsername, status } = req.query;

    if (status && typeof status === 'string') {
      const upperCaseStatus = status.toUpperCase();
      if (upperCaseStatus !== FriendStatusEnum.PENDING &&
        upperCaseStatus !== FriendStatusEnum.ACCEPTED &&
        upperCaseStatus !== FriendStatusEnum.BLOCKED &&
        upperCaseStatus !== FriendStatusEnum.REJECTED
      ) {
        res.status(400).json(errorResponse(400, 'Bad Request', "Invalid Status", `Status '${status}' is not allowed.`));
        return;
      }
      status = upperCaseStatus
    }

    const identifier = req.params.indentifier;
    const host = `${req.protocol}://${req.get("host")}`

    let result: UserFriendDataType[] | null = null;

    if (byUsername == "true") {
      result = await getUserFriends({
        username: identifier
      }, status as FriendStatusEnum)
    } else {
      result = await getUserFriends({
        id: Number(identifier),
      }, status as FriendStatusEnum)
    }

    if (!result) {
      res.status(404).json(errorResponse(404, 'Not Found', "Friend Not Found", "Friend Not Found"))
      return
    }
    result.map(user => {
      if(user.type == "receiver") {
        if(user.receiver.avatar){
          user.receiver.avatar = `${host}/${user.receiver.avatar}`
        }
      }
    })

    result.map(user => {
      if(user.type == "requester") {
        if(user.requester.avatar) {
          user.requester.avatar = `${host}/${user.requester.avatar}`
        }
      }
    })

    result.sort((a, b) => {
    let nameA: string;
    let nameB: string;

    if (a.type === "receiver") {
      nameA = a.receiver.name;
    } else {
      nameA = a.requester.name;
    }

    if (b.type === "receiver") {
      nameB = b.receiver.name;
    } else {
      nameB = b.requester.name;
    }

    //(case-insensitive)
    return nameA.toLowerCase().localeCompare(nameB.toLowerCase());
  });


    res.status(200).json(successResponse(result))

  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage)
    res.status(500).json(
      errorResponse(500, 'Internal Server Error', error, errMessage)
    )
  }
}

export async function requestFriendHandle(req: Request, res: Response) {
  try {
    const result = await requestFriend(req.body);
    res.status(200).json(successResponse(result))

  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage)
    res.status(500).json(
      errorResponse(500, 'Internal Server Error', error, errMessage)
    )
  }
};


export async function updateFriendRequestStatusHandle(req: Request, res: Response) {
  try {
    const result = await AcceptRequestFriend(req.body);
    res.status(200).json(successResponse(result))

  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage)
    res.status(500).json(
      errorResponse(500, 'Internal Server Error', error, errMessage)
    )
  }
}

export async function deleteUserFriendRequestHandle(req: Request, res: Response) {
  try {
    const id = Number(req.params.indentifier)
    const result = await deleteRequestFriend(id)
    res.status(200).json(successResponse(result))

  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage)
    res.status(500).json(
      errorResponse(500, 'Internal Server Error', error, errMessage)
    )
  }
}