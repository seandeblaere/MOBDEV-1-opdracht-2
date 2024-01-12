import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { getTrips } from "../../../core/modules/trips/Trip.api";
import { Trip } from "../../../core/modules/trips/Trip.types";
import "../../design/ErrorView";
import "../../design/LoadingIndicator";
import { buttonStyles, defaultStyles } from "@styles/styles";
import { Router } from "@vaadin/router";

@customElement("trip-overview")
class TripOverview extends LitElement {
  @property()
  isLoading: boolean = false;
  @property()
  trips: Array<Trip> | null = null;
  @property()
  error: string | null = null;
  @property()
  countryCodes: Record<string, string> = {};

  connectedCallback(): void {
    super.connectedCallback();
    this.fetchItems();
    this.fetchCountryCodes();
  }

  fetchItems() {
    this.isLoading = true;
    getTrips()
      .then(({ data }) => {
        this.trips = data;
        this.isLoading = false;
      })
      .catch((error) => {
        this.error = error.message;
        this.isLoading = false;
      });
  }

  async fetchCountryCodes() {
    const countryCodesApiUrl = "https://flagcdn.com/en/codes.json";

    try {
      const response = await fetch(countryCodesApiUrl);
      const data = await response.json();

      if (data) {
        this.countryCodes = data;
      } else {
        console.error("Error fetching country codes:", data);
      }
    } catch (error) {
      console.error("Error fetching country codes:", error);
      throw error;
    }
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  compareTripDates(dateA: Date, dateB: Date): number {
    const timestampA = dateA.getTime();
    const timestampB = dateB.getTime();
    return timestampA - timestampB;
  }

  goToCreateTrip() {
    Router.go("/trips/create");
  }

  render() {
    const plannedTrips = this.trips
      ? this.trips.filter((t) => new Date(t.end) > new Date())
      : [];

    const completedTrips = this.trips
      ? this.trips.filter((t) => new Date(t.end) < new Date())
      : [];

    const sortedPlannedTrips = plannedTrips
      .slice()
      .sort((a, b) =>
        this.compareTripDates(new Date(a.start), new Date(b.start))
      );

    return html`
      <h2>My trips</h2>
      <div class="header">
        <h3>Upcoming Trips</h3>
        <div class="btn-container">
          <button class="btn-primary" @click="${this.goToCreateTrip}">
            Create new trip
          </button>
        </div>
      </div>
      <div class="section-divider"></div>
      <ul class="flex-container">
        ${sortedPlannedTrips.map((t) => this.renderTripCard(t, true))}
      </ul>

      <h3>Finished Trips</h3>
      <div class="section-divider"></div>
      <ul class="flex-container">
        ${completedTrips.map((t) => this.renderTripCard(t))}
      </ul>
    `;
  }

  renderTripCard(trip: Trip, highlightOngoing: boolean = false) {
    const isOngoing =
      highlightOngoing &&
      new Date(trip.start) <= new Date() &&
      new Date(trip.end) >= new Date();

    const countryCode = this.getCountryCode(trip.destination);
    const flagImageUrl = `https://flagcdn.com/${countryCode}.svg`;

    return html`
      <li>
        <a
          href="/trips/${trip._id}"
          class="card ${isOngoing ? "in-progress" : ""}"
          style="background-image: url(${flagImageUrl})"
        >
          <div class="info-container">
            <h4>${trip.destination}</h4>
            <p>
              <strong>From:</strong> ${this.formatDate(new Date(trip.start))}
            </p>
            <p>
              <strong>Until:</strong> ${this.formatDate(new Date(trip.end))}
            </p>
            <p><strong>Transportation:</strong> ${trip.transportation}</p>
          </div>
        </a>
      </li>
    `;
  }

  getCountryCode(destination: string): string {
    const trimmedDestination = destination.trim();
    const formattedDestination = trimmedDestination
      .toLowerCase()
      .replace(/\s/g, "-");
    const countryCode = Object.keys(this.countryCodes).find(
      (key) =>
        this.countryCodes[key].toLowerCase().replace(/\s/g, "-") ===
        formattedDestination
    );
    return countryCode || trimmedDestination;
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

      .btn-container {
        display: flex;
        align-items: center;
      }

      .flex-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }

      ul {
        list-style: none;
        padding: 0;
      }

      li {
        flex: 0 0 calc(48%);
        margin-bottom: 3rem;
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
        color: var(--white);
        border-radius: 1rem;
        background-size: cover;
        background-position: center;
        border: none;
        transition: box-shadow 0.5s ease-in-out;
      }

      .info-container {
        border-radius: 1rem;
        padding: 3rem;
        width: 100%;
        background-color: rgba(16, 36, 45, 0.6);
      }

      .in-progress {
        animation: glow 1.2s infinite alternate;
      }

      @keyframes glow {
        from {
          box-shadow: 0 0 5px rgba(28, 180, 255, 0.8),
            0 0 15px rgba(28, 180, 255, 0.6), 0 0 20px rgba(28, 180, 255, 0.4);
        }
        to {
          box-shadow: 0 0 15px rgba(28, 180, 255, 0.9),
            0 0 40px rgba(28, 180, 255, 0.7), 0 0 45px rgba(28, 180, 255, 0.7);
        }
      }

      .btn-primary {
        width: 10rem;
        margin-bottom: 0;
      }

      .section-divider {
        width: 100%;
        border-top: 2px solid var(--gray100);
        margin: 1rem 0;
      }
    `,
  ];
}

export default TripOverview;
