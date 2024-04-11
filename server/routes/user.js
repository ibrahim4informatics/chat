import { Router } from "express";
import isAuth from "../midlewares/isAuth.js";
import prisma from '../conf/db.js'
import { getUserProfile, searchForUserByUsername, setUserActive, setUserInActive, deleteUser } from "../controllers/user.js";

const route = Router();
route.get('/profile', isAuth, getUserProfile)

route.get('/search', isAuth, searchForUserByUsername)
route.patch('/set-active', isAuth, setUserActive)
route.patch('/set-inactive', isAuth, setUserInActive)
route.delete('/profile/delete', isAuth, deleteUser)

export default route