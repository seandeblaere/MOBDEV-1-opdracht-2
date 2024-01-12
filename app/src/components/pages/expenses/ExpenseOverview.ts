import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { router } from "../../../core/router";
import "../../../components/design/ErrorView";
import "../../../components/design/LoadingIndicator";
import { defaultStyles, buttonStyles } from "../../../style/styles";
import { getExpenses } from "../../../core/modules/expenses/Expenses.api";
import {
  Expense,
  ExpenseType,
} from "../../../core/modules/expenses/Expenses.types";
import { Router } from "@vaadin/router";
import { format } from "date-fns";

@customElement("expense-overview")
class ExpenseOverview extends LitElement {
  @property({ type: Boolean })
  private isLoading: boolean = false;

  @property({ type: Array })
  private expenses: Expense[] = [];

  @property({ type: String })
  private error: string | null = null;

  @property({ type: Object }) location = router.location;

  connectedCallback(): void {
    super.connectedCallback();
    this.fetchExpenses();
  }

  getTripId(): string | null {
    return (this.location.params.id as string) || null;
  }

  async fetchExpenses() {
    const tripId = this.getTripId();

    if (!tripId) {
      console.error("Missing tripId");
      return;
    }

    this.isLoading = true;
    try {
      const response = await getExpenses(tripId);
      this.expenses = response.data;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      this.error = (error as Error).message || "An error occurred";
    } finally {
      this.isLoading = false;
    }
  }

  goToCreateExpense(tripId: string | null) {
    if (tripId) {
      Router.go(`/trips/${tripId}/expenses/create`);
    }
  }

  goToExpenseDetail(
    tripId: string | null | undefined,
    expenseId: string | null | undefined
  ) {
    if (tripId && expenseId) {
      Router.go(`/trips/${tripId}/expenses/${expenseId}`);
    }
  }

  renderExpensesByType(expenseType: ExpenseType) {
    const filteredExpenses = this.expenses.filter(
      (expense) => expense.type === expenseType
    );

    if (filteredExpenses.length === 0) {
      return html``;
    }

    return html`
      <div class="expense-section">
        <h3>${expenseType} Expenses</h3>
        <div class="section-divider"></div>
        <ul class="flex-container">
          ${filteredExpenses.map(
            (expense) => html`
              <li>
                <a
                  @click="${() =>
                    this.goToExpenseDetail(expense.tripId, expense._id)}"
                  class="card"
                >
                  <div class="info-container">
                    <h4>${expense.description}</h4>
                    <p>Amount: ${expense.amount}</p>
                    <p>
                      Date:
                      ${format(new Date(expense.date), "dd MMM yyyy HH:mm")}
                    </p>
                  </div>
                </a>
              </li>
            `
          )}
        </ul>
      </div>
    `;
  }

  render() {
    const { isLoading, expenses, error } = this;

    if (error) {
      return html`<error-view error=${error}></error-view>`;
    }

    if (isLoading || !expenses) {
      return html`<loading-indicator></loading-indicator>`;
    }

    const tripId = this.getTripId();

    return html`
      <div class="header">
        <h2>Expenses</h2>
        <button
          class="btn-primary"
          @click="${() => this.goToCreateExpense(tripId)}"
        >
          Create new expense
        </button>
      </div>
      ${this.renderExpensesByType(ExpenseType.ACCOMMODATION)}
      ${this.renderExpensesByType(ExpenseType.FOOD)}
      ${this.renderExpensesByType(ExpenseType.TRANSPORTATION)}
      ${this.renderExpensesByType(ExpenseType.ENTERTAINMENT)}
      ${this.renderExpensesByType(ExpenseType.ACTIVITIES)}
      ${this.renderExpensesByType(ExpenseType.SHOPPING)}
      ${this.renderExpensesByType(ExpenseType.HEALTH)}
      ${this.renderExpensesByType(ExpenseType.OTHER)}
    `;
  }

  static styles = [
    defaultStyles,
    buttonStyles,
    css`
      :host {
        display: block;
        padding: 2rem 4rem;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      h2 {
        margin-bottom: 1rem;
      }

      .btn-primary {
        width: 12rem;
        margin-bottom: 1rem;
      }

      .expense-section {
        margin-bottom: 2rem;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }

      li {
        flex: 0 0 calc(15%);
        margin-bottom: 1rem;
        transition: transform 0.3s ease-in-out;
      }

      li:hover {
        transform: scale(1.05);
      }

      a {
        text-decoration: none;
        display: block;
        margin: 0;
      }

      .card {
        border-radius: 1rem;
        background-size: cover;
        background-position: center;
        border: none;
        transition: box-shadow 0.5s ease-in-out;
        color: var(--white);
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .info-container {
        border-radius: 1rem;
        padding: 1rem;
        width: 100%;
        background-color: var(--primary500);
      }

      .section-divider {
        width: 100%;
        border-top: 2px solid var(--gray100);
        margin: 1rem 0;
      }
    `,
  ];
}

export default ExpenseOverview;
