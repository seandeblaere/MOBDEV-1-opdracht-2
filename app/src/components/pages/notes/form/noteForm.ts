import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { defaultStyles, buttonStyles } from "../../../../style/styles";
import { AxiosResponse } from "axios";
import { Router } from "@vaadin/router";
import {
  Note,
  NoteBody,
  NoteType,
} from "../../../../core/modules/notes/Notes.types";

@customElement("note-form")
class NoteForm extends LitElement {
  @property({ type: Boolean }) isLoading: boolean = false;
  @property({ type: String }) error: string | null = null;
  @property({ type: String }) submitLabel: string = "Create";
  @property({ type: String })
  reminderDateTime: string = "";
  @property({ type: Function }) method:
    | ((note: NoteBody) => Promise<AxiosResponse<Note>>)
    | null = null;

  @property({ type: Object })
  data: NoteBody = {
    title: "",
    note: "",
    type: NoteType.GENERAL,
  };

  handleSubmit = (event: Event) => {
    event.preventDefault();

    if (!this.method) {
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    const note: NoteBody = {
      title: formData.get("title") as string,
      note: formData.get("note") as string,
      type: formData.get("type") as NoteType,
    };

    console.log(note);

    this.isLoading = true;

    this.method(note)
      .then(({ data }) => {
        Router.go(`/trips/${data.tripId}/notes`);
      })
      .catch((error) => {
        this.error = error;
      })
      .finally(() => {
        this.isLoading = false;
      });
  };

  render() {
    const { isLoading, handleSubmit, data, submitLabel, error } = this;

    return html`
      ${error ? html`<error-view error=${error}></error-view>` : ""}
      <form @submit=${handleSubmit} class="note-form">
        <h3>Note Details</h3>
        <div class="form-row">
          <div class="form-control">
            <label for="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              .value=${data.title}
              placeholder=""
              ?disabled=${isLoading}
              required
            />
          </div>
          <div class="form-control">
            <label for="type">Type</label>
            <select
              name="type"
              id="type"
              .value=${data.type}
              ?disabled=${isLoading}
              required
            >
              ${Object.values(NoteType).map(
                (type) => html` <option value=${type}>${type}</option> `
              )}
            </select>
          </div>
        </div>
        <div class="form-control">
          <label for="note">Note</label>
          <textarea
            name="note"
            id="note"
            .value=${data.note}
            ?disabled=${isLoading}
            required
          ></textarea>
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
      .note-form {
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
        gap: 1.25rem;
      }

      .form-control {
        flex: 1;
        margin-bottom: 1rem;
      }

      .form-control label {
        display: block;
        margin-bottom: 0.3rem;
        font-weight: bold;
      }

      .form-control input,
      .form-control select,
      .form-control textarea {
        width: 100%;
        padding: 0.5rem;
        font-size: 0.875rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
      }

      .btn-primary {
        margin-top: 0.5rem;
      }

      .btn-primary:disabled {
        background-color: #ddd;
        color: #666;
        cursor: not-allowed;
      }
    `,
  ];
}

export default NoteForm;
