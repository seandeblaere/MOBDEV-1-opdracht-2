import { NextFunction, Response, Request } from "express";
import NoteModel from "./Note.model";
import { AuthRequest } from "../../Middleware/auth/authMiddleware";
import NotFoundError from "../../Middleware/error/NotFoudError";
import TripModel from "../Trip/Trip.model";

const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req as AuthRequest;
    const { tripId } = req.params;

    const notes = await NoteModel.find({
      ownerId: user.id,
      tripId: tripId,
    })
      .lean()
      .populate("trip", ["destination", "_id"]);

    res.json(notes);
  } catch (e) {
    next(e);
  }
};

const getNoteDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const { tripId, noteId } = req.params;

    const note = await NoteModel.findOne({
      _id: noteId,
      ownerId: user._id,
      tripId: tripId,
    })
      .lean()
      .populate("trip", ["destination", "_id"]);

    if (!note) {
      throw new NotFoundError("Note not found");
    }

    res.json(note);
  } catch (e) {
    next(e);
  }
};

const createNote = async (req: Request, res: Response, next: NextFunction) => {
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

    const note = new NoteModel({
      ...req.body,
      ownerId: user._id,
      tripId: trip._id,
    });

    const result = await note.save();

    res.json(result);
  } catch (e) {
    next(e);
  }
};

const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req as AuthRequest;
    const { tripId, noteId } = req.params;

    const trip = await TripModel.findOne({
      _id: tripId,
      ownerId: user._id,
    });

    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    const note = await NoteModel.findOneAndUpdate(
      {
        _id: noteId,
        ownerId: user._id,
        tripId: tripId,
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!note) {
      throw new NotFoundError("Note not found");
    }

    res.json(note);
  } catch (e) {
    next(e);
  }
};

const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req as AuthRequest;
    const { tripId, noteId } = req.params;

    const note = await NoteModel.findOneAndDelete({
      _id: noteId,
      ownerId: user._id,
      tripId: tripId,
    });

    if (!note) {
      throw new NotFoundError("Note not found");
    }

    res.json({});
  } catch (e) {
    next(e);
  }
};

export { getNotes, getNoteDetail, createNote, updateNote, deleteNote };
