import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { router } from "../../../core/router";
import "../../../components/design/ErrorView";
import "../../../components/design/LoadingIndicator";
import { buttonStyles, defaultStyles } from "../../../style/styles";
import { getActivities } from "../../../core/modules/activities/Activity.api";
import { Activity } from "../../../core/modules/activities/Activity.types";
import { format } from "date-fns";
import { Router } from "@vaadin/router";

@customElement("activity-calender")
class ActivityCalender extends LitElement {
  @property({ type: Boolean })
  private isLoading: boolean = false;

  @property({ type: Array })
  private activities: Activity[] = [];

  @property({ type: String })
  private error: string | null = null;

  @property({ type: String })
  private tripId: string | null = null;

  @property({ type: Object }) location = router.location;

  connectedCallback(): void {
    super.connectedCallback();
    this.fetchItems();
  }

  async fetchItems() {
    try {
      this.isLoading = true;
      this.tripId = this.getTripId();

      if (!this.tripId) {
        console.error("Missing tripId");
        return;
      }

      const response = await getActivities(this.tripId);
      this.activities = response.data.map((activity) => ({
        ...activity,
        start: new Date(activity.start),
      }));
    } catch (error) {
      console.error("Error fetching activities:", error);
      this.error = (error as Error).message || "An error occurred";
    } finally {
      this.isLoading = false;
    }
  }

  getTripId(): string | null {
    return (this.location.params.id as string) || null;
  }

  render() {
    const { isLoading, activities, error } = this;

    if (error) {
      return html`<error-view error=${error}></error-view>`;
    }

    if (isLoading || !activities) {
      return html`<loading-indicator></loading-indicator>`;
    }

    const activitiesByDate = activities.reduce((grouped, activity) => {
      const startDate =
        activity.start instanceof Date
          ? activity.start
          : new Date(activity.start);

      const dateKey = startDate.toISOString().split("T")[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
      return grouped;
    }, {} as { [date: string]: Activity[] });

    const sortedDateKeys = Object.keys(activitiesByDate).sort();

    return html`
      <div class="header">
        <h2>Activity schedule</h2>
        <div class="btn-container">
          <button class="btn-primary" @click="${() => this.goToActivities()}">
            Activity overview
          </button>
        </div>
      </div>
      ${sortedDateKeys.map((dateKey) => {
        const activitiesForDate = activitiesByDate[dateKey];

        return html`
          <div class="section-container">
            <h3>${format(new Date(dateKey), "yyyy-MM-dd")}</h3>
            <div class="flex-container">
              ${activitiesForDate.map(
                (activity) => html`
                  <div
                    class="card"
                    @click="${() => this.goToActivityDetail(activity._id)}"
                  >
                    <h4>${activity.name}</h4>
                    <p>${activity.location}</p>
                    <p>
                      ${format(new Date(activity.start), "dd-MM-yyy HH:mm")}
                    </p>
                  </div>
                `
              )}
            </div>
            <div class="section-divider"></div>
          </div>
        `;
      })}
    `;
  }

  goToActivityDetail(activityId: string | null | undefined) {
    const tripId = this.getTripId();
    if (tripId && activityId) {
      Router.go(`/trips/${tripId}/activities/${activityId}`);
    }
  }

  goToActivities() {
    const tripId = this.getTripId();
    if (tripId) {
      Router.go(`/trips/${tripId}/activities`);
    }
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
        justify-content: space-between;
        align-items: center;
      }
      .btn-container {
        display: flex;
        gap: 20px;
      }
      .section-container {
        margin-bottom: 1.25rem;
      }
      .flex-container {
        display: flex;
        gap: 20px;
      }
      .card {
        border-radius: 1rem;
        background-size: cover;
        background-position: center;
        background-color: var(--primary500);
        border: none;
        transition: box-shadow 0.5s ease-in-out;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        cursor: pointer;
        color: white;
      }

      h3 {
        margin-bottom: 1rem;
      }

      ul {
        list-style: none;
        padding: 0;
        display: flex;
        gap: 1.5rem;
      }
      .section-divider {
        width: 100%;
        border-top: 2px solid var(--gray100);
        margin: 1rem 0;
      }

      .btn-primary {
        width: 12rem;
        margin-bottom: 0;
      }
    `,
  ];
}

export default ActivityCalender;
