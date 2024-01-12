import { defaultStyles } from "../../style/styles";
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("my-app")
class App extends LitElement {
  render() {
    return html`<slot></slot>`;
  }
  static styles = [defaultStyles];
}

export default App;
