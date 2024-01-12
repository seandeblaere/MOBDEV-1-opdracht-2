import { ObjectId, Document } from "mongoose";
import { Trip } from "../Trip/Trip.types";

export enum NoteType {
  GENERAL = "General",
  REMINDER = "Reminder",
  IMPORTANT = "Important",
  OTHER = "Other",
}

export type Note = Document & {
  _id?: ObjectId;
  title: string;
  note: string;
  type: NoteType;
  ownerId: ObjectId;
  tripId: ObjectId;
  trip?: Trip;
};
