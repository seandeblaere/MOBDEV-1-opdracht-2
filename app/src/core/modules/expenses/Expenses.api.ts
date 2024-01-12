import { API } from "../../../core/network/api";
import { Expense, ExpenseBody } from "./Expenses.types";

const getExpenses = (tripId: string) => {
  return API.get<Expense[]>(`/trips/${tripId}/expenses`);
};

const getExpenseById = (tripId: string, expenseId: string) => {
  return API.get<Expense>(`/trips/${tripId}/expenses/${expenseId}`);
};

const createExpense = (tripId: string, expense: ExpenseBody) => {
  return API.post<Expense>(`/trips/${tripId}/expenses`, expense);
};

const updateExpense = (
  tripId: string,
  expenseId: string,
  expense: ExpenseBody
) => {
  return API.patch<Expense>(`/trips/${tripId}/expenses/${expenseId}`, expense);
};

const deleteExpense = (tripId: string, expenseId: string) => {
  return API.delete<Expense>(`/trips/${tripId}/expenses/${expenseId}`);
};

export {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
