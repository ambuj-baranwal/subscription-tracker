import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  getUserSchema,
  updateUserSchema,
} from "../validations/auth.validation.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getUsers);
router
  .route("/:username")
  .get(validate(getUserSchema), getUser)
  .put(validate(updateUserSchema), updateUser)
  .delete(deleteUser);

export default router;
