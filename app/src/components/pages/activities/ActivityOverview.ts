import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { router } from "../../../core/router";
import "../../../components/design/ErrorView";
import "../../../components/design/LoadingIndicator";
import { defaultStyles, buttonStyles } from "@styles/styles";
import { getActivities } from "../../../core/modules/activities/Activity.api";
import { Activity } from "../../../core/modules/activities/Activity.types";
import { Router } from "@vaadin/router";
import CultureImage from "../../../style/images/activity/masks.png";
import EntertainmentImage from "../../../style/images/activity/Entertainment.png";
import NatureImage from "../../../style/images/activity/Nature.png";
import SportImage from "../../../style/images/activity/Sport.png";
import AdventureImage from "../../../style/images/activity/Adventure.png";
import LeisureImage from "../../../style/images/activity/Leisure.png";
import OtherImage from "../../../style/images/activity/Other.png";

@customElement("activity-overview")
class ActivityOverview extends LitElement {
  @property({ type: Boolean })
  private isLoading: boolean = false;

  @property({ type: Array })
  private activities: Activity[] = [];

  @property({ type: String })
  private error: string | null = null;

  @property({ type: Object }) location = router.location;

  connectedCallback(): void {
    super.connectedCallback();
    this.fetchItems();
  }

  getTripId(): string | null {
    return (this.location.params.id as string) || null;
  }

  async fetchItems() {
    const tripId = this.getTripId();

    if (!tripId) {
      console.error("Missing tripId");
      return;
    }

    this.isLoading = true;
    try {
      const response = await getActivities(tripId);
      this.activities = response.data;
    } catch (error) {
      console.error("Error fetching activities:", error);
      this.error = (error as Error).message || "An error occurred";
    } finally {
      this.isLoading = false;
    }
  }

  goToCreateActivity(tripId: string | null) {
    if (tripId) {
      Router.go(`/trips/${tripId}/activities/create`);
    }
  }

  goToActivityDetail(
    tripId: string | null | undefined,
    activityId: string | null | undefined
  ) {
    if (tripId && activityId) {
      Router.go(`/trips/${tripId}/activities/${activityId}`);
    }
  }

  goToActivityCalender(tripId: string | null | undefined) {
    if (tripId) {
      Router.go(`/trips/${tripId}/activities/calender`);
    }
  }

  formatDateString(dateString: Date) {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  render() {
    const tripId = this.getTripId();

    const { isLoading, activities, error } = this;

    if (error) {
      return html`<error-view error=${error}></error-view>`;
    }

    if (isLoading || !activities) {
      return html`<loading-indicator></loading-indicator>`;
    }

    return html`
      <div class="header">
        <h2>Activities for this trip</h2>
        <div class="btn-container">
          <button
            class="btn-primary"
            @click="${() => this.goToActivityCalender(tripId)}"
          >
            Activities schedule
          </button>
          <button
            class="btn-primary"
            @click="${() => this.goToCreateActivity(tripId)}"
          >
            Create new activity
          </button>
        </div>
      </div>

      <ul class="flex-container">
        ${activities.map((activity) => {
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
            <li>
              <a
                @click="${() =>
                  this.goToActivityDetail(activity.tripId, activity._id)}"
                class="card"
              >
                <div class="info-container">
                  <img
                    src="${activityImage}"
                    alt="${activity.type}"
                    class="activity-image"
                  />
                  <div class="text-info">
                    <h4>${activity.name}</h4>
                    <p><strong>Location:</strong> ${activity.location}</p>
                    <p>
                      <strong>Start:</strong> ${this.formatDateString(
                        activity.start
                      )}
                    </p>
                    ${activity.end
                      ? html`<p>
                          <strong>End:</strong> ${this.formatDateString(
                            activity.end
                          )}
                        </p>`
                      : ""}
                    ${activity.externalUrl
                      ? html`<p>
                          <strong>Url:</strong> ${activity.externalUrl}
                        </p>`
                      : ""}
                  </div>
                </div>
              </a>
            </li>
          `;
        })}
      </ul>
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

      .btn-container {
        display: flex;
        align-items: center;
        gap: 2rem;
      }

      .flex-container {
        display: flex;
        flex-wrap: wrap;
        gap: 4rem;
      }

      ul {
        list-style: none;
        padding: 0;
      }

      li {
        flex: 0 0 calc(30%);
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
        border-radius: 1rem;
        background-size: cover;
        background-position: center;
        border: none;
        color: var(--white);
        display: flex;
        align-items: center;
      }

      .activity-image {
        width: 5rem;
        height: auto;
        margin-right: 1rem;
      }

      .info-container {
        border-radius: 1rem;
        padding: 3rem;
        width: 100%;
        background-color: var(--primary500);
      }

      .btn-primary {
        width: 12rem;
        margin-bottom: 0;
      }
    `,
  ];
}

export default ActivityOverview;
