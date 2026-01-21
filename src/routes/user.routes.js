import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteUser,
  getUser,
  getUsers,
} from "../controllers/user.controller.js";
import {validate} from "../middlewares/validate.middleware.js";
import {getUserSchema} from "../validations/auth.validation.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getUsers).post(getUser); // update later
router
  .route("/:username")
  .get(validate(getUserSchema), getUser)
  .put(getUser) // update later
  .delete(deleteUser); // update later

export default router;
