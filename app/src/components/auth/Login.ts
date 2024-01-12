import { LitElement, html } from "lit";
import "./form/authForm";
import "./LoginComponent";
import { customElement } from "lit/decorators.js";

@customElement("login-page")
export class Login extends LitElement {
  render() {
    return html`
      <login-component>
        <form-component .formType="${"login"}"></form-component>
      </login-component>
    `;
  }
}

export default Login;
