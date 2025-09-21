import expresss from "express"
import { getInterestedBusinessByUser, getInterestedUsersByBusiness, makeAnUserInterested } from "./interested.controller.js";
import { authorizeUser } from "../../middleware/AuthMiddleware.js";


const interestedRouter = expresss.Router();

interestedRouter.post("/make-interested", authorizeUser, makeAnUserInterested);
interestedRouter.get("/interested-user", getInterestedUsersByBusiness);
interestedRouter.get("/interested-business", authorizeUser, getInterestedBusinessByUser);
// interestedRouter.delete("/delete-interest", authorizeUser, getInterestedBusinessByUser);

export default interestedRouter;