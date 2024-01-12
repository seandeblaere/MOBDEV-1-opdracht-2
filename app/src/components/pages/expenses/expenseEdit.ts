import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { defaultStyles } from "../../../style/styles";
import { consume } from "@lit/context";
import {
  Expense,
  ExpenseBody,
} from "../../../core/modules/expenses/Expenses.types";
import { expenseContext } from "./expenseDetailContainer";
import { updateExpense } from "../../../core/modules/expenses/Expenses.api";

import "./form/expenseForm";

@customElement("expense-edit")
class ExpenseEdit extends LitElement {
  @consume({ context: expenseContext, subscribe: true })
  @property({ attribute: false })
  public expense?: Expense | null;

  render() {
    if (!this.expense) {
      return html``;
    }

    return html`
      <div class="container">
        <h2>Edit Expense</h2>
        <expense-form
          submitLabel="Update"
          .data=${this.expense}
          .method=${(body: ExpenseBody) =>
            updateExpense(this.expense!.tripId, this.expense!._id!, body)}
        ></expense-form>
      </div>
    `;
  }

  static styles = [
    defaultStyles,
    css`
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      h2 {
        margin-bottom: 1rem;
      }
    `,
  ];
}

export default ExpenseEdit;
