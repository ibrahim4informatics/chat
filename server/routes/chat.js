import { Router } from "express";
import isAuth from "../midlewares/isAuth.js";
import { createChat, getUserChat, getUserChats, deleteChat } from "../controllers/chat.js";
const route = Router();
route.post('/', isAuth, createChat);
route.get('/', isAuth, getUserChats)
route.get('/:chat_id', isAuth, getUserChat)
route.delete('/:chat_id', isAuth, deleteChat)
export default route;