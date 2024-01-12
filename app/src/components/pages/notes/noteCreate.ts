import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { createNote } from "../../../core/modules/notes/Notes.api";
import { defaultStyles } from "../../../style/styles";

import "./form/noteForm";
import { NoteBody } from "../../../core/modules/notes/Notes.types";
import { consume } from "@lit/context";
import { tripContext } from "../trips/tripDetailContainer";
import { Trip } from "@core/modules/trips/Trip.types";

@customElement("note-create")
class NoteCreate extends LitElement {
  @consume({ context: tripContext, subscribe: true })
  public trip?: Trip | null;

  render() {
    if (!this.trip) {
      return html``;
    }
    return html`
      <div class="container">
        <h2>Create a note</h2>
        <note-form
          .method=${(note: NoteBody) => createNote(this.trip!._id!, note)}
        ></note-form>
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

export default NoteCreate;
