import {
  Activity,
  ActivityBody,
  ActivityType,
} from "../../../../core/modules/activities/Activity.types";
import { defaultStyles, buttonStyles } from "../../../../style/styles";
import { Router } from "@vaadin/router";
import { AxiosResponse } from "axios";
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("activity-form")
class ActivityForm extends LitElement {
  @property({ type: Boolean }) isLoading: boolean = false;
  @property({ type: String }) error: string | null = null;
  @property({ type: String }) submitLabel: string = "Create";
  @property({
    type: Function,
  })
  method:
    | ((activity: ActivityBody) => Promise<AxiosResponse<Activity>>)
    | null = null;

  @property({ type: Object })
  data: ActivityBody = {
    name: "",
    location: "",
    type: ActivityType.OTHER,
    start: new Date(),
    end: new Date(),
    externalUrl: "",
  };

  handleSubmit = (event: Event) => {
    event.preventDefault();

    if (!this.method) {
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    const selectedStartDate = formData.get("start-date") as string;
    const selectedStartTime = formData.get("start-time") as string;
    const selectedEndDate = formData.get("end-date") as string;
    const selectedEndTime = formData.get("end-time") as string;

    const activity: ActivityBody = {
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      type: formData.get("type") as ActivityType,
      start: new Date(`${selectedStartDate}T${selectedStartTime}:00Z`),
      end: new Date(`${selectedEndDate}T${selectedEndTime}:00Z`),
      externalUrl: formData.get("externalUrl") as string,
    };

    this.isLoading = true;
    this.method(activity)
      .then(({ data }) => {
        Router.go(`trips/${data.tripId}/activities`);
      })
      .catch((error) => {
        this.error = error;
      });
  };

  updated(changedProperties: Map<PropertyKey, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has("data") && this.data) {
      this.data.start = new Date(this.data.start);
      this.data.end = new Date(this.data.end);
    }
  }

  render() {
    const { isLoading, data, submitLabel, error } = this;

    return html`
      ${error ? html`<error-view error=${error}></error-view>` : ""}
      <form @submit=${this.handleSubmit} class="activity-form">
        <h3>Activity Details</h3>
        <div class="form-row">
          <div class="form-control">
            <label for="name">Activity Name</label>
            <input
              type="text"
              name="name"
              id="name"
              .value=${data.name}
              placeholder=""
              ?disabled=${isLoading}
              required
            />
          </div>
          <div class="form-control">
            <label for="location">Location</label>
            <input
              type="text"
              name="location"
              id="location"
              .value=${data.location}
              placeholder=""
              ?disabled=${isLoading}
              required
            />
          </div>
          <div class="form-control">
            <label for="type">Activity Type</label>
            <select
              name="type"
              id="type"
              .value=${data.type}
              ?disabled=${isLoading}
              required
            >
              ${Object.values(ActivityType).map(
                (type) => html`<option value=${type}>${type}</option>`
              )}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-control date-time">
            <div>
              <label for="start-date">Start Date</label>
              <input
                type="date"
                name="start-date"
                id="start-date"
                .value=${data.start instanceof Date
                  ? data.start.toISOString().substring(0, 10)
                  : ""}
                ?disabled=${isLoading}
                required
              />
            </div>
            <div>
              <label for="start-time">Start Time</label>
              <input
                type="time"
                name="start-time"
                id="start-time"
                .value=${data.start instanceof Date
                  ? data.start.toISOString().substring(11, 16)
                  : ""}
                ?disabled=${isLoading}
                required
              />
            </div>
          </div>
          <div class="form-control date-time">
            <div>
              <label for="end-date">End Date</label>
              <input
                type="date"
                name="end-date"
                id="end-date"
                .value=${data.end instanceof Date
                  ? data.end.toISOString().substring(0, 10)
                  : ""}
                ?disabled=${isLoading}
                required
              />
            </div>
            <div>
              <label for="end-time">End Time</label>
              <input
                type="time"
                name="end-time"
                id="end-time"
                .value=${data.end instanceof Date
                  ? data.end.toISOString().substring(11, 16)
                  : ""}
                ?disabled=${isLoading}
                required
              />
            </div>
          </div>
          <div class="form-control">
            <label for="externalUrl">External URL</label>
            <input
              type="text"
              name="externalUrl"
              id="externalUrl"
              .value=${data.externalUrl}
              placeholder=""
              ?disabled=${isLoading}
            />
          </div>
        </div>
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
      .activity-form {
        max-width: 35rem;
        margin: auto;
        padding: 1.25rem;
        background-color: var(--white);
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 0 0.7rem rgba(0, 0, 0, 0.1);
      }

      .form-row {
        display: flex;
        flex-wrap: wrap;
        flex-wrap: align-items: center;
        gap: 1.25rem;
      }

      .form-control {
        flex: 1;
        margin-bottom: 1rem;
      }

      .date-time {
        display: flex;
        justify-content: space-between;
        flex: 1;
      }

      .date-time div {
        width: calc(50% - 0.625rem);
      }

      .form-control label {
        display: block;
        margin-bottom: 0.3rem;
        font-weight: bold;
      }

      .form-control input,
      .form-control select {
        width: 100%;
        padding: 0.5rem;
        font-size: 0.875rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
      }

      .btn-primary {
        margin-top: 0.5rem
      }

      .btn-primary:disabled {
        background-color: #ddd;
        color: #666;
        cursor: not-allowed;
      }
    `,
  ];
}

export default ActivityForm;
