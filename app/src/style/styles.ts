import { css } from "lit";

export const defaultStyles = css`
  @import url("https://fonts.googleapis.com/css2?family=Erica+One&display=swap");
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  * {
    margin: 0;
  }

  a {
    color: inherit;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  h1 {
    font-family: var(--font-title);
    font-size: 6rem;
    margin-bottom: 0.5rem;
    color: var(--primary500);
  }

  h2 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    color: var(--primary500);
  }

  h3 {
    font-size: 2rem;
    color: var(--primary900);
  }

  h4 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }

  input {
    display: block;
  }
`;

export const buttonStyles = css`
  .btn-primary {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;

    background-color: var(--secondary);
    color: var(--white);
    border: none;
    border-radius: 0.25rem;
    font-weight: var(--font-weight-bold);
    cursor: pointer;
    text-decoration: none;
  }

  .btn-secondary {
    display: inline-block;
    padding: 0.3rem 0.5rem;
    background-color: var(--grey);
    color: var(--primary500);
    border: 1px solid var(--primary500);
    border-radius: 0.25rem;
    cursor: pointer;
    text-decoration: none;
    font-size: 0.9rem;
  }

  .btn-primary:hover {
    background-color: var(--primary500);
  }
`;

export const loginStyles = css`
  .form-field {
    margin-bottom: 1.25rem;
  }

  .form-label {
    display: block;
    margin-bottom: 0.5rem;
  }

  .form-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--secondary);
    border-radius: 0.25rem;
  }

  .form-button:disabled {
    background-color: var(--grey);
    cursor: not-allowed;
  }
`;

export const formStyles = css`
  .form {
    width: 100%;
  }
  .form--inline {
    width: "100%";
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;
  }
  .form-control {
    margin: 0.5rem 0 0.75rem 0;
  }
  .form-control__label {
    display: block;
    margin-bottom: 0.25rem;
  }
  .form-control__input {
    display: block;
    padding: 0.75rem 1rem;
    width: 100%;

    max-width: 36rem;

    border: none;
    border-radius: var(--border-radius);
  }
`;
