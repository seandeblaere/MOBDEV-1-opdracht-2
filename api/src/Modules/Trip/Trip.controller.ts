import { NextFunction, Request, Response } from "express";
import TripModel from "./Trip.model";
import NotFoundError from "../../Middleware/error/NotFoudError";
import { AuthRequest } from "../../Middleware/auth/authMiddleware";

const getTrips = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req as AuthRequest;
    const trips = await TripModel.find({
      ownerId: user.id,
    });
    res.json(trips);
  } catch (err) {
    next(err);
  }
};

const getTripById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req as AuthRequest;
    const { id } = req.params;
    const trip = await TripModel.findOne({
      _id: id,
      ownerId: user.id,
    });
    if (!trip) {
      throw new NotFoundError("Trip not found");
    }
    res.json(trip);
  } catch (err) {
    next(err);
  }
};

const createTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req as AuthRequest;
    const trip = new TripModel({ ...req.body, ownerId: user.id });
    const result = await trip.save();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const updateTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req as AuthRequest;
    const { id } = req.params;
    const trip = await TripModel.findOneAndUpdate(
      {
        _id: id,
        ownerId: user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!trip) {
      throw new NotFoundError("Trip not found");
    }
    res.json(trip);
  } catch (err) {
    next(err);
  }
};

const deleteTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req as AuthRequest;
    const { id } = req.params;
    const trip = await TripModel.findOneAndDelete({
      _id: id,
      ownerId: user.id,
    });
    if (!trip) {
      throw new NotFoundError("Trip not found");
    }
    res.json({});
  } catch (err) {
    next(err);
  }
};

export { getTrips, createTrip, getTripById, updateTrip, deleteTrip };
