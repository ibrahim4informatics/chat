import { Router } from "express";
import isAuth from "../midlewares/isAuth.js";
import { sendMessage, deleteMessage } from "../controllers/messages.js";

const route = Router();
route.post('/', isAuth, sendMessage)
route.patch('/:message_id', isAuth, deleteMessage)
export default route;