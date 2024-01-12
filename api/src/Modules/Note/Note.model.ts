import mongoose from "mongoose";
import { Note, NoteType } from "./Note.types";
import validateModel from "../../validation/validateModel";

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NoteType),
      default: NoteType.GENERAL,
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

NoteSchema.virtual("trip", {
  ref: "Trip",
  localField: "tripId",
  foreignField: "_id",
  justOne: true,
});

NoteSchema.pre("save", function (next) {
  validateModel(this);
  next();
});

const NoteModel = mongoose.model<Note>("Note", NoteSchema);

export default NoteModel;
