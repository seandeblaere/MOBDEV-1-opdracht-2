import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { router } from "../../../core/router";
import { defaultStyles } from "../../../style/styles";
import { createContext, provide } from "@lit/context";
import { Note } from "../../../core/modules/notes/Notes.types";
import { getNoteById } from "../../../core/modules/notes/Notes.api";

import "../../../components/design/LoadingIndicator";
import "../../../components/design/ErrorView";

export const noteContext = createContext<Note | null>("note");

@customElement("note-detail-container")
class NoteDetailContainer extends LitElement {
  @property()
  isLoading: boolean = false;
  @property({ type: String })
  error: string | null = null;
  @provide({ context: noteContext })
  note: Note | null = null;
  @property({ type: Object }) location = router.location;

  connectedCallback(): void {
    super.connectedCallback();
    this.fetchItems();
  }

  fetchItems() {
    if (
      !this.location.params.id ||
      !this.location.params.noteId ||
      typeof this.location.params.id !== "string" ||
      typeof this.location.params.noteId !== "string"
    ) {
      return;
    }

    this.isLoading = true;

    const tripId = this.location.params.id;
    const noteId = this.location.params.noteId;

    getNoteById(tripId, noteId)
      .then(({ data }) => {
        this.note = data;
        this.isLoading = false;
      })
      .catch((error) => {
        console.error(error);
        this.error = (error.message as string) || "An error occurred";
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  render() {
    const { isLoading, note, error } = this;

    if (error) {
      return html`<error-view error=${error}></error-view>`;
    }

    if (isLoading || !note) {
      return html`<loading-indicator></loading-indicator>`;
    }

    return html`<slot></slot>`;
  }

  static styles = [defaultStyles];
}

export default NoteDetailContainer;
