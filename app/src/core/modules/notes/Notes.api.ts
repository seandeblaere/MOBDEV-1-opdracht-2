import { API } from "../../../core/network/api";
import { Note, NoteBody } from "./Notes.types";

const getNotes = (tripId: string) => {
  return API.get<Note[]>(`/trips/${tripId}/notes`);
};

const getNoteById = (tripId: string, noteId: string) => {
  return API.get<Note>(`/trips/${tripId}/notes/${noteId}`);
};

const createNote = (tripId: string, note: NoteBody) => {
  return API.post<Note>(`/trips/${tripId}/notes`, note);
};

const updateNote = (tripId: string, noteId: string, note: NoteBody) => {
  return API.patch<Note>(`/trips/${tripId}/notes/${noteId}`, note);
};

const deleteNote = (tripId: string, noteId: string) => {
  return API.delete<Note>(`/trips/${tripId}/notes/${noteId}`);
};

export { getNotes, getNoteById, createNote, updateNote, deleteNote };
