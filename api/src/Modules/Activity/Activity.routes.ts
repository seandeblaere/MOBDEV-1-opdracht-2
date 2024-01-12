import { Router } from "express";
import {
  getActivities,
  getActivityDetail,
  createActivity,
  updateActivity,
  deleteActivity,
} from "./Activity.controller";

const router: Router = Router();

router.get("/trips/:tripId/activities", getActivities);
router.get("/trips/:tripId/activities/:activityId", getActivityDetail);
router.post("/trips/:tripId/activities", createActivity);
router.patch("/trips/:tripId/activities/:activityId", updateActivity);
router.delete("/trips/:tripId/activities/:activityId", deleteActivity);

export default router;
