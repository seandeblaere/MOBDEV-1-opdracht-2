import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { router } from "../../../core/router";
import "../../../components/design/ErrorView";
import "../../../components/design/LoadingIndicator";
import { defaultStyles, buttonStyles } from "@styles/styles";
import { getNotes } from "../../../core/modules/notes/Notes.api";
import { Note, NoteType } from "../../../core/modules/notes/Notes.types";
import { Router } from "@vaadin/router";

@customElement("note-overview")
class NoteOverview extends LitElement {
  @property({ type: Boolean })
  private isLoading: boolean = false;

  @property({ type: Array })
  private notes: Note[] = [];

  @property({ type: String })
  private error: string | null = null;

  @property({ type: Object }) location = router.location;

  connectedCallback(): void {
    super.connectedCallback();
    this.fetchItems();
  }

  getTripId(): string | null {
    return (this.location.params.id as string) || null;
  }

  async fetchItems() {
    const tripId = this.getTripId();

    if (!tripId) {
      console.error("Missing tripId");
      return;
    }

    this.isLoading = true;
    try {
      const response = await getNotes(tripId);
      this.notes = response.data;
    } catch (error) {
      console.error("Error fetching notes:", error);
      this.error = (error as Error).message || "An error occurred";
    } finally {
      this.isLoading = false;
    }
  }

  goToCreateNote() {
    const tripId = this.getTripId();
    if (tripId) {
      Router.go(`/trips/${tripId}/notes/create`);
    } else {
      console.error("Unable to determine tripId");
    }
  }

  goToNoteDetail(noteId: string | null | undefined) {
    const tripId = this.getTripId();
    if (tripId && noteId) {
      Router.go(`/trips/${tripId}/notes/${noteId}`);
    }
  }

  renderNotesByType(noteType: NoteType) {
    const filteredNotes = this.notes.filter((note) => note.type === noteType);

    return html`
      <h3>${noteType} Notes</h3>
      <div class="section-divider"></div>
      <ul class="flex-container">
        ${filteredNotes.map(
          (note) => html`
            <li>
              <a @click="${() => this.goToNoteDetail(note._id)}" class="card">
                <div class="info-container">
                  <h4>${note.title}</h4>
                  <p>${note.note}</p>
                </div>
              </a>
            </li>
          `
        )}
      </ul>
    `;
  }

  render() {
    const { isLoading, error } = this;

    if (error) {
      return html`<error-view error=${error}></error-view>`;
    }

    if (isLoading || !this.notes) {
      return html`<loading-indicator></loading-indicator>`;
    }

    return html`
      <div class="header">
        <h2>Notes</h2>
        <div class="btn-container">
          <button class="btn-primary" @click="${() => this.goToCreateNote()}">
            Create new note
          </button>
        </div>
      </div>

      ${this.renderNotesByType(NoteType.GENERAL)}
      ${this.renderNotesByType(NoteType.REMINDER)}
      ${this.renderNotesByType(NoteType.IMPORTANT)}
      ${this.renderNotesByType(NoteType.OTHER)}
    `;
  }

  static styles = [
    defaultStyles,
    buttonStyles,
    css`
      :host {
        display: block;
        padding: 2rem 4rem;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .btn-container {
        display: flex;
        align-items: center;
      }

      .flex-container {
        display: flex;
        flex-wrap: wrap;
        gap: 4rem;
      }

      ul {
        list-style: none;
        padding: 0;
      }

      li {
        flex: 0 0 calc(21%);
        margin-bottom: 3rem;
        transition: transform 0.3s ease-in-out;
      }

      li:hover {
        transform: scale(1.05);
      }

      a {
        text-decoration: none;
        display: block;
        margin: 0;
      }

      .card {
        border-radius: 1rem;
        background-size: cover;
        background-position: center;
        border: none;
        transition: box-shadow 0.5s ease-in-out;
        color: var(--white);
        display: flex;
        align-items: center;
      }

      .info-container {
        border-radius: 1rem;
        padding: 3rem;
        width: 100%;
        background-color: var(--primary500);
      }

      .btn-primary {
        width: 12rem;
        margin-bottom: 0;
      }

      .section-divider {
        width: 100%;
        border-top: 2px solid var(--gray100);
        margin: 1rem 0;
      }
    `,
  ];
}

export default NoteOverview;
