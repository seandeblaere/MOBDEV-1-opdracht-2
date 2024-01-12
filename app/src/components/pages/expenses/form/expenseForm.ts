import {
  Expense,
  ExpenseBody,
  ExpenseType,
} from "../../../../core/modules/expenses/Expenses.types";
import { defaultStyles, buttonStyles } from "../../../../style/styles";
import { Router } from "@vaadin/router";
import { AxiosResponse } from "axios";
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("expense-form")
class ExpenseForm extends LitElement {
  @property({ type: Boolean }) isLoading: boolean = false;
  @property({ type: String }) error: string | null = null;
  @property({ type: String }) submitLabel: string = "Add Expense";
  @property({ type: Function }) method:
    | ((expense: ExpenseBody) => Promise<AxiosResponse<Expense>>)
    | null = null;
  @property({ type: Object })
  data: ExpenseBody = {
    description: "",
    type: ExpenseType.OTHER,
    amount: 0,
    date: new Date(),
  };

  connectedCallback() {
    super.connectedCallback();
  }

  handleSubmit = (event: Event) => {
    event.preventDefault();

    if (!this.method) {
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    const selectedDate = formData.get("date") as string;

    const expense: ExpenseBody = {
      description: formData.get("description") as string,
      type: formData.get("type") as ExpenseType,
      amount: parseFloat(formData.get("amount") as string),
      date: new Date(selectedDate),
    };

    this.isLoading = true;
    this.method(expense)
      .then(({ data }) => {
        Router.go(`trips/${data.tripId}/expenses`);
      })
      .catch((error) => {
        this.error = error;
      });
  };

  render() {
    const { isLoading, handleSubmit, data, submitLabel, error } = this;

    return html`
      ${error ? html`<error-view error=${error}></error-view>` : ""}
      <form @submit=${handleSubmit} class="expense-form">
        <h3>Expense Details</h3>
        <div class="form-row">
          <div class="form-control">
            <label for="description">Description</label>
            <input
              type="text"
              name="description"
              id="description"
              .value=${data.description}
              placeholder=""
              ?disabled=${isLoading}
              required
            />
          </div>
          <div class="form-control">
            <label for="type">Expense Type</label>
            <select
              name="type"
              id="type"
              .value=${data.type}
              ?disabled=${isLoading}
              required
            >
              ${Object.values(ExpenseType).map(
                (type) => html`<option value=${type}>${type}</option>`
              )}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-control">
            <label for="amount">Amount (in local currency)</label>
            <input
              type="number"
              name="amount"
              id="amount"
              .value=${data.amount}
              ?disabled=${isLoading}
              required
              min="0"
            />
          </div>
          <div class="form-control">
            <label for="date">Expense Date</label>
            <input
              type="date"
              name="date"
              id="date"
              .value=${data.date instanceof Date
                ? data.date.toISOString().split("T")[0]
                : ""}
              ?disabled=${isLoading}
              required
            />
          </div>
        </div>
        <button class="btn-primary" type="submit" ?disabled=${isLoading}>
          ${submitLabel}
        </button>
      </form>
    `;
  }

  static styles = [
    defaultStyles,
    buttonStyles,
    css`
      .expense-form {
        max-width: 35rem;
        margin: auto;
        padding: 1.25rem;
        background-color: var(--white);
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 0 0.7rem rgba(0, 0, 0, 0.1);
      }

      .form-row {
        display: flex;
        flex-wrap: wrap;
        gap: 1.25rem;
      }

      .form-control {
        flex: 1;
        margin-bottom: 1rem;
      }

      .form-control label {
        display: block;
        margin-bottom: 0.3rem;
        font-weight: bold;
      }

      .form-control input,
      .form-control select {
        width: 100%;
        padding: 0.5rem;
        font-size: 0.875rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
      }

      .btn-primary {
        margin-top: 0.5rem;
      }

      .btn-primary:disabled {
        background-color: #ddd;
        color: #666;
        cursor: not-allowed;
      }
    `,
  ];
}

export default ExpenseForm;
