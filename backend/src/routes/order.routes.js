import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router = Router();
router.use(verifyJWT);

export default router;
