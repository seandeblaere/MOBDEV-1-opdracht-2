export enum NoteType {
  GENERAL = "General",
  REMINDER = "Reminder",
  IMPORTANT = "Important",
  OTHER = "Other",
}

export type Note = {
  _id?: string;
  title: string;
  note: string;
  type: NoteType;
  ownerId: string;
  tripId: string;
};

export type NoteBody = Omit<Note, "_id" | "ownerId" | "tripId"> & {};
