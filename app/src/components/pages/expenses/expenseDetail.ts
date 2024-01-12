import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { defaultStyles, buttonStyles } from "../../../style/styles";
import { consume } from "@lit/context";
import { Expense } from "../../../core/modules/expenses/Expenses.types";
import { expenseContext } from "./expenseDetailContainer";
import { format } from "date-fns";
import { Router } from "@vaadin/router";
import { deleteExpense } from "../../../core/modules/expenses/Expenses.api";

@customElement("expense-detail")
class ExpenseDetail extends LitElement {
  @consume({ context: expenseContext, subscribe: true })
  @property({ attribute: false })
  public expense?: Expense | null;

  navigateToEdit() {
    if (!this.expense) {
      return;
    }
    const tripId = this.expense.tripId;
    const expenseId = this.expense._id;
    if (!tripId || !expenseId) {
      return;
    }
    Router.go(`/trips/${tripId}/expenses/${expenseId}/edit`);
  }

  async deleteExpenseHandler() {
    if (!this.expense) {
      return;
    }

    const tripId = this.expense.tripId;
    const expenseId = this.expense._id;

    if (!tripId || !expenseId) {
      return;
    }

    try {
      await deleteExpense(tripId, expenseId);
      Router.go(`/trips/${tripId}/expenses`);
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  }

  render() {
    if (!this.expense) {
      return html`<p>No data found</p>`;
    }

    const formattedDate = format(new Date(this.expense.date), "dd MMM yyyy");

    return html`
      <div class="container">
        <h2>${this.expense.description}</h2>
        <section id="expense-details">
          <div class="detail-item">
            <strong>Type:</strong> ${this.expense.type}
          </div>
          <div class="detail-item">
            <strong>Amount:</strong> ${this.expense.amount}
          </div>
          <div class="detail-item"><strong>Date:</strong> ${formattedDate}</div>
          <button class="btn-secondary" @click="${() => this.navigateToEdit()}">
            Edit
          </button>
          <button
            class="btn-delete"
            @click="${() => this.deleteExpenseHandler()}"
          >
            Delete
          </button>
        </section>
      </div>
    `;
  }

  static styles = [
    defaultStyles,
    buttonStyles,
    css`
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        color: var(--text-color);
      }

      h2 {
        margin-bottom: 1rem;
        text-align: center;
      }

      #expense-details {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .detail-item {
        font-size: 1.2rem;
      }

      .btn-secondary,
      .btn-delete {
        width: 10rem;
        padding: 0.3rem;
        font-size: 1rem;
        align-self: center;
        cursor: pointer;
      }

      .btn-secondary {
        border: 2px solid var(--primary500);
        background-color: var(--background-color);
      }

      .btn-delete {
        background-color: var(--red);
        color: var(--white);
        border: none;
        border-radius: 0.25rem;
      }
    `,
  ];
}

export default ExpenseDetail;
