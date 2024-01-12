import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { router } from "../../../core/router";
import { defaultStyles } from "../../../style/styles";
import { createContext, provide } from "@lit/context";
import { Activity } from "../../../core/modules/activities/Activity.types";
import { getActivityById } from "../../../core/modules/activities/Activity.api";

import "../../../components/design/LoadingIndicator";
import "../../../components/design/ErrorView";

export const activityContext = createContext<Activity | null>("activity");

@customElement("activity-detail-container")
class ActivityDetailContainer extends LitElement {
  @property()
  isLoading: boolean = false;
  @property({ type: String })
  error: string | null = null;
  @provide({ context: activityContext })
  activity: Activity | null = null;
  @property({ type: Object }) location = router.location;

  connectedCallback(): void {
    super.connectedCallback();
    this.fetchItems();
  }

  fetchItems() {
    if (
      !this.location.params.id ||
      !this.location.params.activityId ||
      typeof this.location.params.id !== "string" ||
      typeof this.location.params.activityId !== "string"
    ) {
      return;
    }

    this.isLoading = true;

    const tripId = this.location.params.id;
    const activityId = this.location.params.activityId;

    getActivityById(tripId, activityId)
      .then(({ data }) => {
        this.activity = data;
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
    const { isLoading, activity, error } = this;

    if (error) {
      return html`<error-view error=${error}></error-view>`;
    }

    if (isLoading || !activity) {
      return html`<loading-indicator></loading-indicator>`;
    }

    return html`<slot></slot>`;
  }

  static styles = [defaultStyles];
}

export default ActivityDetailContainer;
