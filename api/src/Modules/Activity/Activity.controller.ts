import { NextFunction, Response, Request } from "express";
import ActivityModel from "./Activity.model";
import { AuthRequest } from "../../Middleware/auth/authMiddleware";
import NotFoundError from "../../Middleware/error/NotFoudError";
import TripModel from "../Trip/Trip.model";

const getActivities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const { tripId } = req.params;

    const activities = await ActivityModel.find({
      ownerId: user.id,
      tripId: tripId,
    })
      .lean()
      .populate("trip", ["destination", "_id"]);

    res.json(activities);
  } catch (e) {
    next(e);
  }
};

const getActivityDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const { tripId, activityId } = req.params;

    const activity = await ActivityModel.findOne({
      _id: activityId,
      ownerId: user._id,
      tripId: tripId,
    })
      .lean()
      .populate("trip", ["destination", "_id"]);

    if (!activity) {
      throw new NotFoundError("Activity not found");
    }
    res.json(activity);
  } catch (e) {
    next(e);
  }
};

const createActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const { tripId } = req.params;

    const trip = await TripModel.findOne({
      _id: tripId,
      ownerId: user._id,
    });

    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    const activity = new ActivityModel({
      ...req.body,
      ownerId: user._id,
      tripId: trip._id,
    });

    const result = await activity.save();

    res.json(result);
  } catch (e) {
    next(e);
  }
};

const updateActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const { tripId, activityId } = req.params;

    const trip = await TripModel.findOne({
      _id: tripId,
      ownerId: user._id,
    });

    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    const activity = await ActivityModel.findOneAndUpdate(
      {
        _id: activityId,
        ownerId: user._id,
        tripId: tripId,
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!activity) {
      throw new NotFoundError("Activity not found");
    }

    res.json(activity);
  } catch (e) {
    next(e);
  }
};

const deleteActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const { tripId, activityId } = req.params;

    const activity = await ActivityModel.findOneAndDelete({
      _id: activityId,
      ownerId: user._id,
      tripId: tripId,
    });

    if (!activity) {
      throw new NotFoundError("Activity not found");
    }

    res.json({});
  } catch (e) {
    next(e);
  }
};

export {
  getActivities,
  getActivityDetail,
  createActivity,
  updateActivity,
  deleteActivity,
};
