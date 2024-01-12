import { Router } from "express";
import {
  getExpenses,
  getExpenseDetail,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./Expense.controller";

const router: Router = Router();

router.get("/trips/:tripId/expenses", getExpenses);
router.get("/trips/:tripId/expenses/:expenseId", getExpenseDetail);
router.post("/trips/:tripId/expenses", createExpense);
router.patch("/trips/:tripId/expenses/:expenseId", updateExpense);
router.delete("/trips/:tripId/expenses/:expenseId", deleteExpense);

export default router;
