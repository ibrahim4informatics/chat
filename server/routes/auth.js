import { Router } from "express";
import passport from "passport";
import { registerByemail, refreshToken, loginByEmail, logoutUser, googleLoginRedirect } from "../controllers/auth.js";
import isAuth from "../midlewares/isAuth.js";
const route = Router();
/**
 * *JWT auth with email and password
 */
route.post("/register-email", registerByemail)
route.post("/login-email", loginByEmail)
route.post("/refresh-token", refreshToken);
/**
 * Google oauth with passport
 */
route.get("/google", passport.authenticate('google'))
route.get("/google/redirect", passport.authenticate('google'), googleLoginRedirect)
/**
 * Log out users
 */
route.get('/logout', isAuth, logoutUser)
export default route;