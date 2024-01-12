import { API } from "../../../core/network/api";
import { Activity, ActivityBody } from "./Activity.types";

const getActivities = (tripId: string) => {
  return API.get<Activity[]>(`/trips/${tripId}/activities`);
};

const getActivityById = (tripId: string, activityId: string) => {
  return API.get<Activity>(`/trips/${tripId}/activities/${activityId}`);
};

const createActivity = (tripId: string, activity: ActivityBody) => {
  return API.post<Activity>(`/trips/${tripId}/activities`, activity);
};

const updateActivity = (
  tripId: string,
  activityId: string,
  activity: ActivityBody
) => {
  return API.patch<Activity>(
    `/trips/${tripId}/activities/${activityId}`,
    activity
  );
};

const deleteActivity = (tripId: string, activityId: string) => {
  return API.delete<Activity>(`/trips/${tripId}/activities/${activityId}`);
};

export {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
};
