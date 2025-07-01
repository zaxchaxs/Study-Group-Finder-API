import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import {
  createPomodoroHistory,
  deletePomodoroHistory,
  getAllPomodoroHistory,
  getDetailPomodoroHistory,
  getUserPomodoroHistory,
  updatePomodoroHistory,
} from "../services/pomodoroHistory.service";

export async function getAllPomodoroHistoryHandle(req: Request, res: Response) {
  try {
    const result = await getAllPomodoroHistory();
    res.status(200).json(successResponse(result));
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage);
    res
      .status(500)
      .json(errorResponse(500, "Internal Server Error", error, errMessage));
  }
}

export async function getUserPomodoroHistoryHandle(
  req: Request,
  res: Response,
) {
  try {
    const userId = Number(req.params.id);
    const result = await getUserPomodoroHistory(userId);
    res.status(200).json(successResponse(result));
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage);
    res
      .status(500)
      .json(errorResponse(500, "Internal Server Error", error, errMessage));
  }
}

export async function getDetailPomodoroHistoryHandle(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);
    const result = await getDetailPomodoroHistory(id);
    res.status(200).json(successResponse(result));
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage);
    res
      .status(500)
      .json(errorResponse(500, "Internal Server Error", error, errMessage));
  }
}

export async function postPomodoroHistoryHandle(req: Request, res: Response) {
  try {
    const result = await createPomodoroHistory(req.body);
    res.status(200).json(successResponse(result));
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage);
    res
      .status(500)
      .json(errorResponse(500, "Internal Server Error", error, errMessage));
  }
}

export async function updatePomodoroHistoryHandle(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await updatePomodoroHistory(id, req.body);
    res.status(200).json(successResponse(result));
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage);
    res
      .status(500)
      .json(errorResponse(500, "Internal Server Error", error, errMessage));
  }
}

export async function deletePomodoroHistoryHandle(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await deletePomodoroHistory(id);
    res.status(200).json(successResponse(result));
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errMessage);
    res
      .status(500)
      .json(errorResponse(500, "Internal Server Error", error, errMessage));
  }
}
