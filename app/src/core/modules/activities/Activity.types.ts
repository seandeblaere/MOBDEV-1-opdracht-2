export enum ActivityType {
  SPORT = "Sport",
  CULTURE = "Culture",
  ADVENTURE = "Adventure",
  LEISURE = "Leisure",
  NATURE = "Nature",
  ENTERTAINMENT = "Entertainment",
  OTHER = "Other",
}

export type Activity = {
  _id?: string;
  name: string;
  location: string;
  type: ActivityType;
  externalUrl?: string;
  start: Date;
  end: Date;
  ownerId: string;
  tripId: string;
};

export type ActivityBody = Omit<Activity, "_id" | "ownerId" | "tripId">;
