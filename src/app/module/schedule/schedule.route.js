import express from "express";
import { makeAMeetingSchedule, retrieveAllMeetingSchedule } from "./schedule.controller.js";

const scheduleRouter = express.Router();

scheduleRouter.post("/make-schedule", makeAMeetingSchedule);
scheduleRouter.get("/retrieve-schedule", retrieveAllMeetingSchedule);
scheduleRouter.delete("/delete-schedule/:scheduleId", retrieveAllMeetingSchedule);

export default scheduleRouter;