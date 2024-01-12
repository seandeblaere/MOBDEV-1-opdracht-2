import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { defaultStyles, buttonStyles } from "../../../style/styles";
import { consume } from "@lit/context";
import { Note } from "../../../core/modules/notes/Notes.types";
import { noteContext } from "./noteDetailContainer";
import { Router } from "@vaadin/router";
import { deleteNote } from "../../../core/modules/notes/Notes.api";

@customElement("note-detail")
class NoteDetail extends LitElement {
  @consume({ context: noteContext, subscribe: true })
  @property({ attribute: false })
  public note?: Note | null;

  navigateToEdit() {
    if (!this.note) {
      return;
    }
    const tripId = this.note.tripId;
    const noteId = this.note._id;
    if (!tripId || !noteId) {
      return;
    }
    Router.go(`/trips/${tripId}/notes/${noteId}/edit`);
  }

  async deleteNoteHandler() {
    if (!this.note) {
      return;
    }

    const tripId = this.note.tripId;
    const noteId = this.note._id;

    if (!tripId || !noteId) {
      return;
    }

    try {
      await deleteNote(tripId, noteId);
      Router.go(`/trips/${tripId}/notes`);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

  render() {
    if (!this.note) {
      return html``;
    }

    return html`
      <div class="container">
        <h2>${this.note.title}</h2>
        <section id="note-details">
          <div class="detail-item">
            <strong>Type:</strong> ${this.note.type}
          </div>
          <div class="detail-item">${this.note.note}</div>
          <button class="btn-secondary" @click="${() => this.navigateToEdit()}">
            Edit
          </button>
          <button class="btn-delete" @click="${() => this.deleteNoteHandler()}">
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

      #note-details {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .detail-item {
        font-size: 1.2rem;
      }

      .btn-secondary {
        width: 10rem;
        padding: 0.3rem;
        border: 2px solid var(--primary500);
        background-color: var(--background-color);
        font-size: 1rem;
        align-self: center;
      }

      .btn-delete {
        width: 10rem;
        padding: 0.3rem;
        background-color: var(--red);
        color: var(--white);
        font-size: 1rem;
        align-self: center;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
      }
    `,
  ];
}

export default NoteDetail;
