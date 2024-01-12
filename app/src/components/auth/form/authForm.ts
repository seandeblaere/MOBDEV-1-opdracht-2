import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "../../design/LoadingIndicator";
import "../../design/ErrorView";
import { login, register } from "../../../core/modules/auth/Auth.api";
import { Router } from "@vaadin/router";
import * as Storage from "../../../core/storage";
import {
  buttonStyles,
  defaultStyles,
  loginStyles,
} from "../../../style/styles";

@customElement("form-component")
export class FormComponent extends LitElement {
  @property({ type: String })
  formType: "login" | "register" = "login";

  @property({ type: Boolean })
  isLoading: boolean = false;

  handleClickRegister() {
    Router.go("/register");
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name =
      this.formType === "register" ? (formData.get("name") as string) : "";

    if (this.formType === "login") {
      this.handleLogin({ email, password });
    } else {
      this.handleRegistration({ email, password, name });
    }
  }

  handleLogin({ email, password }: { email: string; password: string }) {
    this.isLoading = true;

    login({ email, password })
      .then(({ data }) => {
        this.isLoading = false;
        Storage.saveAuthToken(data.token);
        Router.go("/trips");
      })
      .catch((error) => {
        this.isLoading = false;
        console.error(error);
      });
  }

  handleRegistration({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    this.isLoading = true;

    register({ email, password, name })
      .then(() => {
        return login({ email, password });
      })
      .then(({ data }) => {
        this.isLoading = false;
        Storage.saveAuthToken(data.token);
        Router.go("/trips");
      })
      .catch((error) => {
        this.isLoading = false;
        console.error(error);
      });
  }

  render() {
    return html`
      <form @submit="${this.handleSubmit}">
        <div class="form-field">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            class="form-input"
            placeholder="Email"
          />
        </div>
        <div class="form-field">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            class="form-input"
            placeholder="Password"
          />
        </div>
        ${this.formType === "register"
          ? html`
              <div class="form-field">
                <label for="name" class="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  class="form-input"
                  placeholder="Name"
                />
              </div>
            `
          : ""}
        <button type="submit" class="btn-primary" ?disabled="${this.isLoading}">
          ${this.formType === "login" ? "Login" : "Register"}
        </button>
        ${this.formType === "login"
          ? html`
              <div>
                <span>Don't have an account?</span>
                <button
                  type="button"
                  class="btn-secondary"
                  @click="${this.handleClickRegister}"
                >
                  Register
                </button>
              </div>
            `
          : ""}
      </form>
    `;
  }

  static styles = [defaultStyles, buttonStyles, loginStyles];
}
