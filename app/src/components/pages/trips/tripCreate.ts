import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

import "./form/tripForm";
import { createTrip } from "../../../core/modules/trips/Trip.api";
import { defaultStyles } from "../../../style/styles";

@customElement("trip-create")
class TripCreate extends LitElement {
  render() {
    return html`
      <div class="container">
        <h2>Create a trip</h2>
        <trip-form .method=${createTrip}></trip-form>
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

export default TripCreate;
