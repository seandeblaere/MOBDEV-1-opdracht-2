import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { defaultStyles } from "@styles/styles";
import { Note, NoteBody } from "../../../core/modules/notes/Notes.types";
import { updateNote } from "../../../core/modules/notes/Notes.api";
import "./form/noteForm";
import { consume } from "@lit/context";
import { noteContext } from "./noteDetailContainer";

@customElement("note-edit")
class NoteEdit extends LitElement {
  @consume({ context: noteContext, subscribe: true })
  @property({ attribute: false })
  public note?: Note | null;

  render() {
    if (!this.note) {
      return html``;
    }
    return html`
      <div class="container">
        <h2>Edit Note</h2>
        <note-form
          submitLabel="Update"
          .data=${this.note}
          .method=${(note: NoteBody) => {
            console.log(note);
            updateNote(this.note!.tripId, this.note!._id!, note);
          }}
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

export default NoteEdit;
