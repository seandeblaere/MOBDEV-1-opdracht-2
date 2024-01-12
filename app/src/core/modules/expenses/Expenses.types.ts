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

export type Expense = {
  _id?: string;
  description: string;
  type: ExpenseType;
  amount: number;
  date: Date;
  ownerId: string;
  tripId: string;
};

export type ExpenseBody = Omit<Expense, "_id" | "ownerId" | "tripId">;
