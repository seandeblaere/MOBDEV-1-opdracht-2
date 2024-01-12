import { ObjectId, Document } from "mongoose";
import { Trip } from "../Trip/Trip.types";

export enum ExpenseType {
  ACCOMMODATION = "Accommodation",
  FOOD = "Food",
  TRANSPORTATION = "Transportation",
  ENTERTAINMENT = "Entertainment",
  ACTIVITIES = "Activities",
  SHOPPING = "Shopping",
  HEALTH = "Health",
  OTHER = "Other",
}

export type Expense = Document & {
  _id?: ObjectId;
  description: string;
  type: ExpenseType;
  amount: number;
  date: Date;
  ownerId: ObjectId;
  tripId: ObjectId;
  trip?: Trip;
};
