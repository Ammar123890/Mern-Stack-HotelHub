import { sign_up, sign_in, resetPassword, forgotPassword } from "../controllers/auth.js";
import express from "express";

const router = express('router');


router.post('/sign-up', sign_up);
router.post('/sign-in', sign_in);
router.post('/forgotPassword/:email', forgotPassword);
router.post('/resetPassword', resetPassword);


export default router;