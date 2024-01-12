import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { Router } from "@vaadin/router";
import { getCurrentUser } from "../../core/modules/auth/Auth.api";
import { logout } from "../auth/AuthContainer";
import { buttonStyles, defaultStyles } from "../../style/styles";

@customElement("navigation-component")
class NavigationComponent extends LitElement {
  currentUser: string | null = null;

  connectedCallback(): void {
    super.connectedCallback();

    getCurrentUser()
      .then(({ data }) => {
        this.currentUser = data.name;
        this.requestUpdate();
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
      });
  }

  handleLogoutClick() {
    logout();
  }

  render() {
    return html`
      <nav>
        <div class="user-info">
          ${this.currentUser !== null
            ? `Hello, ${this.currentUser}`
            : "Loading..."}
        </div>
        <ul>
          <li>
            <a href="/trips" @click=${() => Router.go("/trips")}>My Trips</a>
          </li>
          <li>
            <button class="btn-secondary" @click=${this.handleLogoutClick}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    `;
  }

  static styles = [
    defaultStyles,
    buttonStyles,
    css`
      nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 4rem;
        background-color: var(--primary);
        border-bottom: 2px solid var(--primary500);
      }

      .user-info {
        font-weight: bold;
        font-size: 1.2rem;
      }

      ul {
        list-style-type: none;
        display: flex;
        align-items: center;
        gap: 2rem;
      }

      li {
        margin: 0;
      }

      a {
        text-decoration: none;
        cursor: pointer;
        font-weight: bold;
      }

      .btn-secondary {
        width: 5rem;
        padding: 0.5rem;
        border: 3px solid var(--primary500);
        background-color: var(--background-color);
        font-size: 1rem;
      }
    `,
  ];
}

export default NavigationComponent;
