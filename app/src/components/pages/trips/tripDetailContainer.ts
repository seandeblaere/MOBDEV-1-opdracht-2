import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { router } from "@core/router";
import { defaultStyles } from "@styles/styles";
import { createContext, provide } from "@lit/context";
import "@components/design/LoadingIndicator";
import "@components/design/ErrorView";
import { Trip } from "@core/modules/trips/Trip.types";
import { getTripById } from "../../../core/modules/trips/Trip.api";

export const tripContext = createContext<Trip | null>("trip");

@customElement("trip-detail-container")
class TripDetailContainer extends LitElement {
  @property()
  isLoading: boolean = false;
  @provide({ context: tripContext })
  trip: Trip | null = null;
  @property()
  error: string | null = null;

  @property({ type: Object }) location = router.location;

  connectedCallback(): void {
    super.connectedCallback();
    this.fetchItems();
  }

  fetchItems() {
    if (
      !this.location.params.id ||
      typeof this.location.params.id !== "string"
    ) {
      return;
    }

    this.isLoading = true;
    getTripById(this.location.params.id)
      .then(({ data }) => {
        this.trip = data;
        this.isLoading = false;
      })
      .catch((error) => {
        this.error = error.message;
        this.isLoading = false;
      });
  }

  render() {
    const { isLoading, trip, error } = this;

    if (error) {
      return html`<error-view error=${error}></error-view>`;
    }

    if (isLoading || !trip) {
      return html`<loading-indicator></loading-indicator>`;
    }

    return html`<slot></slot>`;
  }

  static styles = [defaultStyles];
}

export default TripDetailContainer;
