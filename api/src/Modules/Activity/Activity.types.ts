import { ObjectId, Document } from "mongoose";
import { Trip } from "../Trip/Trip.types";

export enum ActivityType {
  SPORT = "Sport",
  CULTURE = "Culture",
  ADVENTURE = "Adventure",
  LEISURE = "Leisure",
  NATURE = "Nature",
  ENTERTAINMENT = "Entertainment",
  OTHER = "Other",
}

export type Activity = Document & {
  _id?: ObjectId;
  name: string;
  location: string;
  type: ActivityType;
  externalUrl?: string;
  start: Date;
  end?: Date;
  ownerId: ObjectId;
  tripId: ObjectId;
  trip?: Trip;
};
