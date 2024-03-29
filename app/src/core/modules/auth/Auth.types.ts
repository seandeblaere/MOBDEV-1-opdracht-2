export type User = {
  _id: string;
  email: string;
  name: string;
};

export type Auth = {
  token: string;
};

export type RegisterUser = {
  email: string;
  password: string;
  name: string;
};
