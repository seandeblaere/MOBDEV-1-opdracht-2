import { LitElement, html } from "lit";
import "./form/authForm";
import "./LoginComponent";
import { customElement } from "lit/decorators.js";

@customElement("register-page")
export class Register extends LitElement {
  render() {
    return html`
      <login-component>
        <form-component .formType="${"register"}"></form-component>
      </login-component>
    `;
  }
}

export default Register;
