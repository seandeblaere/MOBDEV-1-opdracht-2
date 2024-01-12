import { LitElement, html, css, unsafeCSS } from "lit";
import { defaultStyles } from "@styles/styles";
import "./form/authForm";
import loginBackground from "../../style/images/login/login-background.jpg";
import { customElement } from "lit/decorators.js";

@customElement("login-component")
export class LoginComponent extends LitElement {
  render() {
    return html`
      <div class="login-image"></div>
      <div class="login-container">
        <div class="login-form__title-container">
          <h1>TripTide</h1>
        </div>
        <div class="login-form-container">
          <slot></slot>
        </div>
      </div>
    `;
  }

  static styles = [
    defaultStyles,
    css`
      :host {
        display: flex;
        height: 100vh;
        background-color: var(--primary);
        padding-right: 5rem;
      }
      .login-image {
        background: url("${unsafeCSS(loginBackground)}") right/cover;
        flex: 3;
      }
      .login-container {
        flex: 1;
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
      }
      .login-form__title-container {
        text-align: center;
        margin-bottom: 1.5rem;
      }
      .login-form-container {
        background-color: var(--background);
        padding: 3rem;
        border-radius: 1.25rem;
        box-shadow: 0 0.1rem 0.2rem var(--primary900);
      }
    `,
  ];
}

export default LoginComponent;
