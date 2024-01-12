import mongoose from "mongoose";
import validateModel from "../../validation/validateModel";
import { TransportationType, Trip } from "./Trip.types";
import ActivityModel from "../Activity/Activity.model";

const TripSchema = new mongoose.Schema<Trip>(
  {
    destination: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    transportation: {
      type: String,
      required: true,
    },
    limit: Number,
    myCurrency: String,
    localCurrency: String,
  },
  {
    timestamps: true,
  }
);

TripSchema.pre("save", function (next) {
  validateModel(this);
  next();
});

TripSchema.pre("deleteOne", { document: true, query: false }, function (next) {
  ActivityModel.deleteMany({ tripId: this._id }).exec();
  next();
});

TripSchema.pre(["findOneAndDelete", "deleteMany"], function (next) {
  const id = this.getFilter()["_id"];
  ActivityModel.deleteMany({ tripId: id }).exec();
  next();
});

const TripModel = mongoose.model<Trip>("Trip", TripSchema);

export default TripModel;
