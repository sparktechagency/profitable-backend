import express from "express";
// import { authorizeUser } from "../../middleware/AuthMiddleware.js";
import { getNdaFilteredByUserRole } from "./nda.controller.js";

const ndaRouter = express.Router();

ndaRouter.post("/create-nda", getNdaFilteredByUserRole );
ndaRouter.get("/get-nda", getNdaFilteredByUserRole );

export default ndaRouter;