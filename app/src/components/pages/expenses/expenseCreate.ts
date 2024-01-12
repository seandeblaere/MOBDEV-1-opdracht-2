import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import "./form/expenseForm";
import { createExpense } from "../../../core/modules/expenses/Expenses.api";
import { tripContext } from "../trips/tripDetailContainer";
import { consume } from "@lit/context";
import { Trip } from "../../../core/modules/trips/Trip.types";
import { ExpenseBody } from "../../../core/modules/expenses/Expenses.types";
import { defaultStyles } from "@styles/styles";

@customElement("expense-create")
class ExpenseCreate extends LitElement {
  @consume({ context: tripContext, subscribe: true })
  public trip?: Trip | null;

  render() {
    if (!this.trip) {
      return html``;
    }
    return html`
      <div class="container">
        <h2>Create an expense</h2>
        <expense-form
          .method=${(expense: ExpenseBody) =>
            createExpense(this.trip!._id!, expense)}
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

export default ExpenseCreate;
