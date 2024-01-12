import mongoose from "mongoose";
import { Activity, ActivityType } from "./Activity.types";
import validateModel from "../../validation/validateModel";

const ActivitySchema = new mongoose.Schema<Activity>(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
    },
    externalUrl: {
      type: String,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
    },
  },
  {
    timestamps: true,
  }
);

ActivitySchema.virtual("trip", {
  ref: "Trip",
  localField: "tripId",
  foreignField: "_id",
  justOne: true,
});

ActivitySchema.pre("save", function (next) {
  validateModel(this);
  next();
});

const ActivityModel = mongoose.model<Activity>("Activity", ActivitySchema);

export default ActivityModel;
