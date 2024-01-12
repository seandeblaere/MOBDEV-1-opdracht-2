import { NextFunction, Response, Request } from "express";
import ExpenseModel from "./Expense.model";
import { AuthRequest } from "../../Middleware/auth/authMiddleware";
import NotFoundError from "../../Middleware/error/NotFoudError";
import TripModel from "../Trip/Trip.model";

const getExpenses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req as AuthRequest;
    const { tripId } = req.params;

    const expenses = await ExpenseModel.find({
      ownerId: user.id,
      tripId: tripId,
    })
      .lean()
      .populate("trip", ["destination", "_id"]);

    res.json(expenses);
  } catch (e) {
    next(e);
  }
};

const getExpenseDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const { tripId, expenseId } = req.params;

    const expense = await ExpenseModel.findOne({
      _id: expenseId,
      ownerId: user._id,
      tripId: tripId,
    })
      .lean()
      .populate("trip", ["destination", "_id"]);

    if (!expense) {
      throw new NotFoundError("Expense not found");
    }
    res.json(expense);
  } catch (e) {
    next(e);
  }
};

const createExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    const expense = new ExpenseModel({
      ...req.body,
      ownerId: user._id,
      tripId: trip._id,
    });

    const result = await expense.save();

    res.json(result);
  } catch (e) {
    next(e);
  }
};

const updateExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const { tripId, expenseId } = req.params;

    const trip = await TripModel.findOne({
      _id: tripId,
      ownerId: user._id,
    });

    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    const expense = await ExpenseModel.findOneAndUpdate(
      {
        _id: expenseId,
        ownerId: user._id,
        tripId: tripId,
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      throw new NotFoundError("Expense not found");
    }

    res.json(expense);
  } catch (e) {
    next(e);
  }
};

const deleteExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as AuthRequest;
    const { tripId, expenseId } = req.params;

    const expense = await ExpenseModel.findOneAndDelete({
      _id: expenseId,
      ownerId: user._id,
      tripId: tripId,
    });

    if (!expense) {
      throw new NotFoundError("Expense not found");
    }

    res.json({});
  } catch (e) {
    next(e);
  }
};

export {
  getExpenses,
  getExpenseDetail,
  createExpense,
  updateExpense,
  deleteExpense,
};
