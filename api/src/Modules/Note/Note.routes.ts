import { Router } from "express";
import {
  getNotes,
  getNoteDetail,
  createNote,
  updateNote,
  deleteNote,
} from "./Note.controller";

const router: Router = Router();

router.get("/trips/:tripId/notes", getNotes);
router.get("/trips/:tripId/notes/:noteId", getNoteDetail);
router.post("/trips/:tripId/notes", createNote);
router.patch("/trips/:tripId/notes/:noteId", updateNote);
router.delete("/trips/:tripId/notes/:noteId", deleteNote);

export default router;
