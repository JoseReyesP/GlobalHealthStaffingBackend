import express from "express";
import scheduleCtrl from "../controllers/schedule.controller.js";
import authCtrl from "../../Auth/controllers/auth.controller.js";

const router = express.Router();

router.route("/api/schedule").get(scheduleCtrl.list).post(scheduleCtrl.create);

router
  .route("/api/schedule/:scheduleId")
  .get(authCtrl.requireSignin, scheduleCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, scheduleCtrl.update)
  .delete(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    scheduleCtrl.remove
  );

router.param("scheduleId", scheduleCtrl.scheduleByID);

export default router;
