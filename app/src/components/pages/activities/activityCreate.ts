import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./form/activityForm";
import { createActivity } from "../../../core/modules/activities/Activity.api";
import { tripContext } from "../trips/tripDetailContainer";
import { consume } from "@lit/context";
import { Trip } from "../../../core/modules/trips/Trip.types";
import { ActivityBody } from "../../../core/modules/activities/Activity.types";
import { defaultStyles } from "../../../style/styles";

@customElement("activity-create")
class ActivityCreate extends LitElement {
  @consume({ context: tripContext, subscribe: true })
  public trip?: Trip | null;

  render() {
    if (!this.trip) {
      return html``;
    }
    return html`
      <div class="container">
        <h2>Create an activity</h2>
        <activity-form
          .method=${(activity: ActivityBody) =>
            createActivity(this.trip!._id!, activity)}
        ></activity-form>
      </div>
    `;
  }

  static styles = [
    defaultStyles,
    css`
      :host {
        display: block;
      }

      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      h2 {
        margin-bottom: 1rem;
      }
    `,
  ];
}

export default ActivityCreate;
