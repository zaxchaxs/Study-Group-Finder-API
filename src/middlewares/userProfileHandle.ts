import { Request, Response, NextFunction } from "express";
import { upsertUserProfileSchema } from "../schemas/user.schema";
import { errorResponse } from "../utils/response";

export async function validateUpsertUserProfile(req: Request, res: Response, next: NextFunction) {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    res.status(400).json({ message: 'Invalid User ID' });
    return
  }

  const result = upsertUserProfileSchema.safeParse(req.body)
  if (!result.success) {
    const parsed = JSON.parse(result.error.message)
    res.status(400).json(errorResponse(400, 'Bad Request', parsed, parsed[0]?.message));
    return;
  }

  const {
    latitude,
    longitude,
    isLocationShared
  } = req.body;

  // Validate location shared flag
  if (typeof isLocationShared !== 'boolean') {
    res.status(400).json(errorResponse(400, 'Bad Request', 'isLocationShared must be a boolean.', 'isLocationShared must be a boolean.'));
    return;
  }

  // Handle mandatory 'location' if isLocationShared is true
  if (isLocationShared && (latitude === undefined || longitude === undefined || typeof latitude !== 'number' || typeof longitude !== 'number')) {
    res.status(400).json(errorResponse(400, 'Bad Request', 'Latitude and longitude are required when isLocationShared is true.', 'Latitude and longitude are required when isLocationShared is true.'));
    return;
  }

  next();
}