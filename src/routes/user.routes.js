import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {deleteUser, getUser, getUsers} from "../controllers/user.controller.js";



const router = Router();

router.route("/")
    .get(getUsers)
    .post(getUser) // update later
router.route("/:id")
    .get(getUser)
    .put(getUser) // update later
    .delete(deleteUser)  // update later

export default router;