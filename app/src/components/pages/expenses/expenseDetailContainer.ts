import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { router } from "../../../core/router";
import { defaultStyles } from "../../../style/styles";
import { createContext, provide } from "@lit/context";
import { Expense } from "../../../core/modules/expenses/Expenses.types";
import { getExpenseById } from "../../../core/modules/expenses/Expenses.api";

import "../../../components/design/LoadingIndicator";
import "../../../components/design/ErrorView";

export const expenseContext = createContext<Expense | null>("expense");

@customElement("expense-detail-container")
class ExpenseDetailContainer extends LitElement {
  @property()
  isLoading: boolean = false;
  @property({ type: String })
  error: string | null = null;
  @provide({ context: expenseContext })
  expense: Expense | null = null;
  @property({ type: Object }) location = router.location;

  connectedCallback(): void {
    super.connectedCallback();
    this.fetchItems();
  }

  fetchItems() {
    if (
      !this.location.params.id ||
      !this.location.params.expenseId ||
      typeof this.location.params.id !== "string" ||
      typeof this.location.params.expenseId !== "string"
    ) {
      return;
    }

    this.isLoading = true;

    const tripId = this.location.params.id;
    const expenseId = this.location.params.expenseId;

    getExpenseById(tripId, expenseId)
      .then(({ data }) => {
        this.expense = data;
        this.isLoading = false;
      })
      .catch((error) => {
        console.error(error);
        this.error = (error.message as string) || "An error occurred";
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  render() {
    const { isLoading, expense, error } = this;

    if (error) {
      return html`<error-view error=${error}></error-view>`;
    }

    if (isLoading || !expense) {
      return html`<loading-indicator></loading-indicator>`;
    }

    return html`<slot></slot>`;
  }

  static styles = [defaultStyles];
}

export default ExpenseDetailContainer;
