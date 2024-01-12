import { ObjectId } from "mongoose";
import { Document } from "mongoose";

export enum TransportationType {
  Car = "Car",
  Train = "Train",
  Plane = "Plane",
  Bus = "Bus",
  Ship = "Ship",
  Motorcycle = "Motorcycle",
}

export type Trip = Document & {
  _id?: string;
  destination: string;
  ownerId: ObjectId;
  start: Date;
  end: Date;
  transportation: TransportationType;
  limit: number;
  myCurrency: string;
  localCurrency: string;
};
