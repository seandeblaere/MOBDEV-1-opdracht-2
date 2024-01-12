import mongoose from "mongoose";
import { Expense, ExpenseType } from "./Expense.types";
import validateModel from "../../validation/validateModel";

const ExpenseSchema = new mongoose.Schema<Expense>(
  {
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(ExpenseType),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ExpenseSchema.virtual("trip", {
  ref: "Trip",
  localField: "tripId",
  foreignField: "_id",
  justOne: true,
});

ExpenseSchema.pre("save", function (next) {
  validateModel(this);
  next();
});

const ExpenseModel = mongoose.model<Expense>("Expense", ExpenseSchema);

export default ExpenseModel;
