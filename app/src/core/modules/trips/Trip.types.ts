export enum TransportationType {
  Car = "Car",
  Train = "Train",
  Plane = "Plane",
  Bus = "Bus",
  Ship = "Ship",
  Motorcycle = "Motorcycle",
}

export type Trip = {
  _id?: string;
  destination: string;
  ownerId: string;
  start: Date;
  end: Date;
  transportation: TransportationType;
  limit?: number | null;
  myCurrency: String;
  localCurrency: String;
};

export type TripBody = Omit<Trip, "_id" | "ownerId">;
