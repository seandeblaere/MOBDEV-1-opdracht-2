import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { defaultStyles } from "../../../style/styles";
import { consume } from "@lit/context";
import {
  Activity,
  ActivityBody,
} from "../../../core/modules/activities/Activity.types";
import { activityContext } from "./activityDetailContainer";
import { updateActivity } from "../../../core/modules/activities/Activity.api";

import "./form/activityForm";

@customElement("activity-edit")
class ActivityEdit extends LitElement {
  @consume({ context: activityContext, subscribe: true })
  @property({ attribute: false })
  public activity?: Activity | null;

  render() {
    if (!this.activity) {
      return html``;
    }

    return html`
      <div class="container">
        <h2>Edit Activity</h2>
        <activity-form
          submitLabel="Update"
          .data=${this.activity}
          .method=${(body: ActivityBody) =>
            updateActivity(this.activity!.tripId, this.activity!._id!, body)}
        ></activity-form>
      </div>
    `;
  }

  static styles = [
    defaultStyles,
    css`
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

export default ActivityEdit;
