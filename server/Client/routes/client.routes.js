import express from "express";
import clientCtrl from "../controllers/client.controller.js";
import authCtrl from "../../Auth/controllers/auth.controller.js";

const router = express.Router();

router.route("/api/clients").get(clientCtrl.list).post(clientCtrl.create);

router
  .route("/api/clients/:clientId")
  .get(authCtrl.requireSignin, clientCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, clientCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, clientCtrl.remove);

router.param("clientId", clientCtrl.clientByID);

export default router;
