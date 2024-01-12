import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { buttonStyles, defaultStyles } from "../../../style/styles";
import { consume } from "@lit/context";
import { Trip } from "../../../core/modules/trips/Trip.types";
import { tripContext } from "./tripDetailContainer";
import { getActivities } from "../../../core/modules/activities/Activity.api";
import { Activity } from "../../../core/modules/activities/Activity.types";
import { getNotes } from "../../../core/modules/notes/Notes.api";
import { Note, NoteType } from "../../../core/modules/notes/Notes.types";
import { getExpenses } from "../../../core/modules/expenses/Expenses.api";
import { Expense } from "../../../core/modules/expenses/Expenses.types";
import { Router } from "@vaadin/router";
import CultureImage from "../../../style/images/activity/masks.png";
import EntertainmentImage from "../../../style/images/activity/Entertainment.png";
import NatureImage from "../../../style/images/activity/Nature.png";
import SportImage from "../../../style/images/activity/Sport.png";
import AdventureImage from "../../../style/images/activity/Adventure.png";
import LeisureImage from "../../../style/images/activity/Leisure.png";
import OtherImage from "../../../style/images/activity/Other.png";
import { deleteTrip } from "../../../core/modules/trips/Trip.api";

@customElement("trip-detail")
class TripDetail extends LitElement {
  @consume({ context: tripContext, subscribe: true })
  @property({ attribute: false })
  public trip?: Trip | null;

  @property({ attribute: false })
  public activities: Array<Activity> = [];

  @property({ attribute: false })
  public notes: Array<Note> = [];

  @property({ attribute: false })
  public expenses: Array<Expense> = [];

  @property({ attribute: false })
  public totalExpenseAmount: number = 0;

  private countdown: string = "";
  private countdownInterval?: number;
  private exchangeRates: Record<string, number> = {};

  firstUpdated() {
    this.setupCountdownInterval();
  }

  updated(changedProperties: Map<PropertyKey, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has("trip")) {
      this.fetchExchangeRates();
      this.fetchActivities();
      this.fetchNotes();
      this.fetchExpenses();
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.clearCountdownInterval();
  }

  setupCountdownInterval() {
    this.clearCountdownInterval();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  clearCountdownInterval() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = undefined;
    }
  }

  async fetchExchangeRates() {
    try {
      const localCurrencyCode = this.trip?.localCurrency;

      if (localCurrencyCode) {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/e7db7745dcd52591d8b3acc7/latest/${localCurrencyCode}`
        );
        const data = await response.json();
        this.exchangeRates = data.conversion_rates;
        console.log(this.exchangeRates);
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  }

  convertToMyCurrency(amount: number): number {
    const localCurrencyCode = this.trip?.localCurrency as string;
    const myCurrencyCode = this.trip?.myCurrency as string;

    if (localCurrencyCode && myCurrencyCode) {
      const localToMyCurrencyRate = this.exchangeRates[myCurrencyCode];

      if (localToMyCurrencyRate) {
        const amountInMyCurrency = amount * localToMyCurrencyRate;
        return amountInMyCurrency;
      }
    }

    return amount;
  }

  async fetchActivities() {
    if (this.trip && this.trip._id) {
      try {
        const response = await getActivities(this.trip._id);
        this.activities = response.data;
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    }
  }

  async fetchNotes() {
    if (this.trip && this.trip._id) {
      try {
        const response = await getNotes(this.trip._id);
        this.notes = response.data;
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    }
  }

  async fetchExpenses() {
    if (this.trip && this.trip._id) {
      try {
        const response = await getExpenses(this.trip._id);
        this.expenses = response.data;

        this.totalExpenseAmount = this.expenses.reduce(
          (total, expense) => total + expense.amount,
          0
        );
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    }
  }

  updateCountdown() {
    this.countdown = this.calculateCountdown();
    this.requestUpdate();
  }

  navigateToActivities() {
    if (this.trip) {
      const tripId = this.trip._id;
      if (tripId) {
        Router.go(`/trips/${tripId}/activities`);
      }
    }
  }

  navigateToNotes() {
    if (this.trip) {
      const tripId = this.trip._id;
      if (tripId) {
        Router.go(`/trips/${tripId}/notes`);
      }
    }
  }

  navigateToExpenses() {
    if (this.trip) {
      const tripId = this.trip._id;
      if (tripId) {
        Router.go(`/trips/${tripId}/expenses`);
      }
    }
  }

  navigateToEdit() {
    if (this.trip) {
      const tripId = this.trip._id;
      if (tripId) {
        Router.go(`/trips/${tripId}/edit`);
      }
    }
  }

  async deleteTripHandler() {
    if (!this.trip) {
      return;
    }

    const tripId = this.trip._id;

    if (!tripId) {
      return;
    }

    try {
      await deleteTrip(tripId);
      Router.go(`/trips/`);
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  }

  calculateCountdown() {
    if (!this.trip || !this.trip.start) {
      return "";
    }

    const now = new Date();
    const tripStart = new Date(this.trip.start);
    const tripEnd = new Date(this.trip.end);

    if (now < tripStart) {
      const timeDiff = tripStart.getTime() - now.getTime();
      const secondsRemaining = Math.floor(timeDiff / 1000);

      const hours = Math.floor(secondsRemaining / 3600);
      const minutes = Math.floor((secondsRemaining % 3600) / 60);
      const seconds = secondsRemaining % 60;

      return `in ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    } else if (now > tripEnd) {
      return "Trip has finished!";
    }

    return "Trip has started!";
  }

  render() {
    if (!this.trip) {
      return html``;
    }

    const importantNotes = this.notes.filter(
      (note) => note.type === NoteType.IMPORTANT
    );

    const sortedActivities = this.activities.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    const numberOfActivitiesToShow = 3;
    const upcomingActivities = sortedActivities.slice(
      0,
      numberOfActivitiesToShow
    );

    let remainingAmount = 0;
    if (this.trip?.limit) {
      const totalExpenseInMyCurrency = this.convertToMyCurrency(
        this.totalExpenseAmount
      );
      remainingAmount = this.trip.limit - totalExpenseInMyCurrency;
    }

    return html`
      <div class="trip-header">
        <div class="title-container">
          <h2>${this.trip.destination}</h2>
          ${this.countdown
            ? html`<div class="countdown-timer">${this.countdown}</div>`
            : ""}
        </div>
        <div class="button-container">
          <button class="btn-secondary" @click="${() => this.navigateToEdit()}">
            Edit
          </button>
          <button class="btn-delete" @click="${() => this.deleteTripHandler()}">
            Delete
          </button>
        </div>
      </div>

      <div class="trip-detail__sections">
        <section class="trip-detail__section">
          <div class="section-container">
            <h3>Upcoming activities</h3>
            ${upcomingActivities.map((activity) => {
              let activityImage;
              switch (activity.type) {
                case "Culture":
                  activityImage = CultureImage;
                  break;
                case "Entertainment":
                  activityImage = EntertainmentImage;
                  break;
                case "Nature":
                  activityImage = NatureImage;
                  break;
                case "Sport":
                  activityImage = SportImage;
                  break;
                case "Adventure":
                  activityImage = AdventureImage;
                  break;
                case "Leisure":
                  activityImage = LeisureImage;
                  break;
                default:
                  activityImage = OtherImage;
              }

              return html`
                <div class="activity-item">
                  <img
                    src="${activityImage}"
                    alt="${activity.type}"
                    class="activity-image"
                  />
                  <div class="activity-details">
                    <h4>${activity.name}</h4>
                    <p>
                      Start:
                      ${new Date(activity.start).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div class="section-divider"></div>
              `;
            })}
            <button
              class="btn-primary"
              @click="${() => this.navigateToActivities()}"
            >
              My activities
            </button>
          </div>
        </section>

        <section class="trip-detail__section">
          <div class="section-container">
            <h3>Important Notes</h3>
            ${importantNotes.map(
              (note) => html`
                <div class="note-card">
                  <h4>${note.title}</h4>
                  <p>${note.note}</p>
                </div>
                <div class="section-divider"></div>
              `
            )}
            <button
              class="btn-primary"
              @click="${() => this.navigateToNotes()}"
            >
              My notes
            </button>
          </div>
        </section>

        <section class="trip-detail__section">
          <div class="section-container">
            <h3>Expenses</h3>
            <div class="expense-info">
              <h4>Total Expenses:</h4>
              <p>
                Local currency: ${this.totalExpenseAmount}
                ${this.trip?.localCurrency}
              </p>
              <p>
                Your currency:
                ${this.convertToMyCurrency(this.totalExpenseAmount).toFixed(2)}
                ${this.trip?.myCurrency}
              </p>
              ${this.trip.limit
                ? html`
                    <div class="expense-limit-info">
                      <h4>
                        Expense Limit: ${this.trip.limit}
                        ${this.trip.myCurrency}
                      </h4>
                      ${this.convertToMyCurrency(this.totalExpenseAmount) >
                      this.trip.limit
                        ? html`<p class="limit">
                            You have reached your expense limit!
                          </p>`
                        : html`<p>
                            ${remainingAmount.toFixed(2)}
                            ${this.trip.myCurrency} left until your expense
                            limit.
                          </p>`}
                    </div>
                  `
                : html``}
            </div>
            <div class="section-divider"></div>
            <button
              class="btn-primary"
              @click="${() => this.navigateToExpenses()}"
            >
              My expenses
            </button>
          </div>
        </section>
      </div>
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

      .trip-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;
      }

      .title-container {
        display: flex;
        align-items: center;
        width: 100%;
      }

      .countdown-timer {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--red);
        margin-left: 1rem;
      }

      .button-container {
        display: flex;
        gap: 1rem;
      }

      .btn-delete {
        width: 10rem;
        padding: 0.5rem;
        border: none;
        border-radius: 0.25rem;
        background-color: var(--red);
        font-weight: var(--font-weight-bold);
        font-size: 1rem;
        color: var(--white);
        cursor: pointer;
      }

      .trip-detail__sections {
        display: flex;
        justify-content: center;
        background-color: var(--primary);
        padding: 2rem 4rem;
        border-radius: var(--border-radius);
        border: 3px solid var(--primary500);
      }

      .trip-detail__section {
        width: 30%;
      }

      .section-container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }

      .activity-item,
      .note-card,
      .expense-info {
      }

      .activity-item {
        display: flex;
        align-items: center;
      }

      .activity-image {
        width: 3rem;
        height: auto;
        margin-right: 1rem;
      }

      h4 {
        font-size: 1.5rem;
      }

      .btn-primary {
        width: 15rem;
      }

      .btn-secondary {
        width: 10rem;
        padding: 0.5rem;
        border: 3px solid var(--primary500);
        background-color: var(--background-color);
        font-weight: var(--font-weight-bold);
        font-size: 1rem;
      }

      .section-divider {
        width: 70%;
        border-top: 2px solid var(--primary500);
        margin: 1rem 0;
      }

      .expense-info {
        display: flex;
        flex-direction: column;
        align-items: center; /* Center horizontally */
        text-align: center; /* Center text content */
      }

      .expense-info h4 {
        margin-bottom: 0.5rem; /* Add some spacing below the header */
      }

      .expense-info p {
        margin: 0; /* Remove default margin for paragraphs */
      }

      .limit {
        color: var(--red);
        font-weight: bold;
      }
    `,
  ];
}

export default TripDetail;
