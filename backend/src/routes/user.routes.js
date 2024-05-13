import { Router } from "express";
import {
    changeCurrentPassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateProfilePicture,
    updateUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "profilePicture",
            maxCount: 1,
        },
    ]),
    registerUser
);
router.route("/login").post(loginUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/profile-picture").post(
    verifyJWT,
    upload.fields([
        {
            name: "profilePicture",
            maxCount: 1,
        },
    ]),
    updateProfilePicture
);
router.route("/update-user").put(verifyJWT, updateUser);

// secure route or private routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-user").get(verifyJWT, getCurrentUser);

export default router;
