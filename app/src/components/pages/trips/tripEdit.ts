import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { defaultStyles } from "@styles/styles";
import { consume } from "@lit/context";
import { Trip, TripBody } from "../../../core/modules/trips/Trip.types";
import { tripContext } from "./tripDetailContainer";
import { updateTrip } from "../../../core/modules/trips/Trip.api";

import "./form/tripForm";

@customElement("trip-edit")
class TripEdit extends LitElement {
  @consume({ context: tripContext, subscribe: true })
  @property({ attribute: false })
  public trip?: Trip | null;

  render() {
    if (!this.trip) {
      return html``;
    }

    return html`
      <div class="container">
        <h2>Edit Trip</h2>
        <trip-form
          submitLabel="Update"
          .data=${this.trip}
          .method=${(body: TripBody) => updateTrip(this.trip!._id!, body)}
        ></trip-form>
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

export default TripEdit;
