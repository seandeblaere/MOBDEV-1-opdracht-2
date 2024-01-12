import {
  TransportationType,
  Trip,
  TripBody,
} from "../../../../core/modules/trips/Trip.types";
import { buttonStyles, defaultStyles } from "../../../../style/styles";
import { Router } from "@vaadin/router";
import { AxiosResponse } from "axios";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("trip-form")
class TripForm extends LitElement {
  @property({ type: Boolean }) isLoading: boolean = false;
  @property({ type: String }) error: string | null = null;
  @property({ type: String }) submitLabel: string = "Create";
  @property({ type: Function }) method:
    | ((trip: TripBody) => Promise<AxiosResponse<Trip>>)
    | null = null;
  @property({ type: Boolean }) isExpenseLimitEnabled: boolean = false;
  @property({ type: Number }) expenseLimit: number | null = null;
  @property({ type: String }) myCurrency: string = "EUR";
  @property({ type: String }) selectedCurrency: string = "EUR";
  @property({ type: Array }) currencies: string[] = [];
  @property({ type: Object }) exchangeRates: Record<string, number> = {};
  @property({ type: String }) selectedStartDate: string = "";
  @property({ type: String }) selectedEndDate: string = "";
  @property({ type: Object }) data: TripBody = {
    destination: "",
    start: new Date(),
    end: new Date(),
    transportation: TransportationType.Plane,
    limit: 0,
    myCurrency: "EUR",
    localCurrency: "EUR",
  };

  connectedCallback() {
    super.connectedCallback();
    this.fetchCurrencies();
    this.initData();
  }

  initData() {
    this.selectedStartDate =
      new Date(this.data?.start)?.toISOString()?.split("T")[0] || "";
    this.selectedEndDate =
      new Date(this.data?.end)?.toISOString()?.split("T")[0] || "";
    this.myCurrency = (this.data?.myCurrency as string) || "EUR";
    this.selectedCurrency = (this.data?.localCurrency as string) || "EUR";
  }

  async fetchCurrencies() {
    const apiUrl =
      "https://v6.exchangerate-api.com/v6/e7db7745dcd52591d8b3acc7/latest/EUR";

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.result === "success") {
        this.currencies = Object.keys(data.conversion_rates);
        this.exchangeRates = data.conversion_rates;
      } else {
        console.error("Error fetching currencies:", data.error);
      }
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  }

  handleMyCurrencyChange(event: Event) {
    this.myCurrency = (event.target as HTMLSelectElement).value;
  }

  handleLocalCurrencyChange(event: Event) {
    this.selectedCurrency = (event.target as HTMLSelectElement).value;
  }

  handleStartDateChange(event: Event) {
    this.selectedStartDate = (event.target as HTMLInputElement).value;
  }

  handleEndDateChange(event: Event) {
    this.selectedEndDate = (event.target as HTMLInputElement).value;
  }

  handleExpenseLimitCheckboxChange = (event: Event) => {
    this.isExpenseLimitEnabled = (event.target as HTMLInputElement).checked;
  };

  handleTransportationChange(event: Event) {
    this.data.transportation = (event.target as HTMLSelectElement)
      .value as TransportationType;
  }

  handleSubmit = (event: Event) => {
    event.preventDefault();

    if (!this.method) {
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);

    const trip: TripBody = {
      destination: formData.get("destination") as string,
      start: new Date(this.selectedStartDate),
      end: new Date(this.selectedEndDate),
      transportation: formData.get("transportation") as TransportationType,
      limit: this.isExpenseLimitEnabled
        ? parseFloat(formData.get("expenseLimit") as string)
        : null,
      myCurrency: this.myCurrency,
      localCurrency: this.selectedCurrency,
    };

    this.isLoading = true;
    this.method(trip)
      .then(({ data }) => {
        Router.go(`/trips/${data._id}`);
      })
      .catch((error) => {
        this.error = error;
      });
  };

  render() {
    const {
      isLoading,
      data,
      submitLabel,
      error,
      isExpenseLimitEnabled,
      expenseLimit,
    } = this;

    return html`
      ${error ? html`<error-view error=${error}></error-view>` : ""}
      <form @submit=${this.handleSubmit} class="trip-form">
        <div class="form-control">
          <label class="form-control__label" for="destination"
            >Destination</label
          >
          <input
            class="form-control__input full-width"
            type="text"
            name="destination"
            id="destination"
            .value=${data?.destination}
            placeholder=""
            ?disabled=${isLoading}
            required
          />
        </div>

        <div class="form-control-group">
          <div class="form-control">
            <label class="form-control__label" for="transportation"
              >Transportation</label
            >
            <select
              class="form-control__input"
              id="transportation"
              name="transportation"
              @change=${this.handleTransportationChange}
              ?disabled=${isLoading}
            >
              ${Object.values(TransportationType).map(
                (type) => html`
                  <option
                    value=${type}
                    ?selected=${type === data?.transportation}
                  >
                    ${type}
                  </option>
                `
              )}
            </select>
          </div>
        </div>

        <div class="form-control-group">
          <div class="form-control">
            <label class="form-control__label" for="start">Start date</label>
            <input
              class="form-control__input date-input"
              type="date"
              name="start"
              id="start"
              .value=${this.selectedStartDate}
              @change=${this.handleStartDateChange}
              ?disabled=${isLoading}
              required
            />
          </div>

          <div class="form-control">
            <label class="form-control__label" for="end">End date</label>
            <input
              class="form-control__input date-input"
              type="date"
              name="end"
              id="end"
              .value=${this.selectedEndDate}
              @change=${this.handleEndDateChange}
              ?disabled=${isLoading}
              required
            />
          </div>
        </div>

        <div class="form-control-group">
          <div class="form-control">
            <label class="form-control__label" for="myCurrency"
              >My Currency</label
            >
            <select
              class="form-control__input"
              id="myCurrency"
              name="myCurrency"
              @change=${this.handleMyCurrencyChange}
              ?disabled=${isLoading}
            >
              ${this.currencies.map(
                (currency) => html`
                  <option
                    value=${currency}
                    ?selected=${currency === this.myCurrency}
                  >
                    ${currency}
                  </option>
                `
              )}
            </select>
          </div>

          <div class="form-control">
            <label class="form-control__label" for="localCurrency"
              >Local Currency</label
            >
            <select
              class="form-control__input"
              id="localCurrency"
              name="localCurrency"
              @change=${this.handleLocalCurrencyChange}
              ?disabled=${isLoading}
            >
              ${this.currencies.map(
                (currency) => html`
                  <option
                    value=${currency}
                    ?selected=${currency === this.selectedCurrency}
                  >
                    ${currency}
                  </option>
                `
              )}
            </select>
          </div>
        </div>

        <div class="form-control">
          <label class="form-control__label" for="setExpenseLimit"
            >Set Expense Limit for Trip:</label
          >
          <input
            type="checkbox"
            id="setExpenseLimit"
            name="setExpenseLimit"
            @change=${this.handleExpenseLimitCheckboxChange}
            ?disabled=${isLoading}
          />
        </div>

        ${isExpenseLimitEnabled
          ? html`
              <div class="form-control">
                <label class="form-control__label" for="expenseLimit"
                  >Expense Limit (your currency)</label
                >
                <div class="input-group">
                  <input
                    class="form-control__input"
                    type="number"
                    name="expenseLimit"
                    id="expenseLimit"
                    .value=${expenseLimit || ""}
                    ?disabled=${isLoading}
                    required
                    min="0"
                    step="10"
                  />
                </div>
              </div>
            `
          : ""}

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
      .trip-form {
        max-width: 400px;
        margin: auto;
        padding: 20px;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      .form-control-group {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
      }

      .form-control {
        margin-bottom: 15px;
      }

      .form-control__label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }

      .form-control__input {
        width: 100%;
        padding: 8px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
      }

      .date-input {
        flex: 1;
      }

      .input-group {
        display: flex;
        gap: 15px;
        justify-content: space-between; /* Aligns items to the left and right */
      }

      .input-group select {
        flex: 1;
      }
    `,
  ];
}

export default TripForm;
