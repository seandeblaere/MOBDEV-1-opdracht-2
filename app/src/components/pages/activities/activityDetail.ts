import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { format } from "date-fns";
import { defaultStyles, buttonStyles } from "../../../style/styles";
import { consume } from "@lit/context";
import { Activity } from "../../../core/modules/activities/Activity.types";
import { activityContext } from "./activityDetailContainer";
import { Router } from "@vaadin/router";
import { deleteActivity } from "../../../core/modules/activities/Activity.api";

@customElement("activity-detail")
class ActivityDetail extends LitElement {
  @consume({ context: activityContext, subscribe: true })
  @property({ attribute: false })
  public activity?: Activity | null;

  navigateToEdit() {
    if (!this.activity) {
      return;
    }
    const tripId = this.activity.tripId;
    const activityId = this.activity._id;
    if (!tripId || !activityId) {
      return;
    }
    Router.go(`/trips/${tripId}/activities/${activityId}/edit`);
  }

  async deleteActivityHandler() {
    if (!this.activity) {
      return;
    }

    const tripId = this.activity.tripId;
    const activityId = this.activity._id;

    if (!tripId || !activityId) {
      return;
    }

    try {
      await deleteActivity(tripId, activityId);
      Router.go(`/trips/${tripId}/activities`);
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  }

  render() {
    if (!this.activity) {
      return html``;
    }

    const formattedStartDate = format(
      new Date(this.activity.start),
      "dd MMM yyyy HH:mm"
    );

    const formattedEndDate = this.activity.end
      ? format(new Date(this.activity.end), "dd MMM yyyy HH:mm")
      : null;

    return html`
      <div class="container">
        <h2>${this.activity.name}</h2>
        <section id="activity-details">
          <div class="detail-item">
            <strong>Location:</strong> ${this.activity.location}
          </div>
          <div class="detail-item">
            <strong>Type:</strong> ${this.activity.type}
          </div>
          <div class="detail-item">
            <strong>Start Date:</strong> ${formattedStartDate}
          </div>
          ${formattedEndDate
            ? html`<div class="detail-item">
                <strong>End Date:</strong> ${formattedEndDate}
              </div>`
            : ""}
          ${this.activity.externalUrl
            ? html`<div class="detail-item">
                <strong>External URL:</strong>
                <a href="${this.activity.externalUrl}" target="_blank"
                  >${this.activity.externalUrl}</a
                >
              </div>`
            : ""}
          <button class="btn-secondary" @click="${() => this.navigateToEdit()}">
            Edit
          </button>
          <button
            class="btn-delete"
            @click="${() => this.deleteActivityHandler()}"
          >
            Delete
          </button>
        </section>
      </div>
    `;
  }

  static styles = [
    defaultStyles,
    buttonStyles,
    css`
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        color: var(--text-color);
      }

      h2 {
        margin-bottom: 1rem;
        text-align: center;
      }

      #activity-details {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .detail-item {
        font-size: 1.2rem;
      }

      .btn-secondary,
      .btn-delete {
        width: 10rem;
        padding: 0.3rem;
        font-size: 1rem;
        align-self: center;
        cursor: pointer;
      }

      .btn-secondary {
        border: 2px solid var(--primary500);
        background-color: var(--background-color);
      }

      .btn-delete {
        background-color: var(--red);
        color: var(--white);
        border: none;
        border-radius: 0.25rem;
      }
    `,
  ];
}

export default ActivityDetail;
