import { Router } from "express";
import {
  changeCurrentPassword,
  getUserDetail,
  login,
  logout,
  refreshAccessToken,
  resetPassword,
  signUp,
  // updateUserAvatar
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createUserSchema } from "../validations/auth.validation.js";

const router = Router();

router.route("/sign-up").post(
  upload.fields([
    // multer file upload middleware
    {
      name: "avatar",
      maxCount: 1,
    },
    // {
    //     name: "coverImage",
    //     maxCount: 1, // No of files allowed
    // }
  ]),
  validate(createUserSchema),
  signUp,
);

router.route("/sign-in").post(login);

// secured routes
router.route("/sign-out").post(verifyJWT, logout);
router.route("/refresh-token").put(refreshAccessToken);
router.route("/change-password").put(verifyJWT, changeCurrentPassword);
router.route("/reset-password").put(verifyJWT, resetPassword);
router.route("/user").get(verifyJWT, getUserDetail);
// router.route("/update-avatar").put(verifyJWT, updateUserAvatar)

export default router;
