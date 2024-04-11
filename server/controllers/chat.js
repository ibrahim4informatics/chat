import prisma from '../conf/db.js'
const createChat = async (req, res) => {
    const { receiver_id, msg } = req.body;
    const existChat = await prisma.chat.findFirst({ where: { members: { some: { id: receiver_id } } } });
    if (existChat) return res.status(300).json({ msg: `chat already exist`, chat_id: existChat.id })
    if (!receiver_id || !msg) return res.status(400).json({ msg: `missing data` })
    const receiver = await prisma.user.findUnique({ where: { id: receiver_id } });
    if (!receiver) return res.status(404).json({ msg: `can not create chat between unexisted users` });
    try {
        const chat = await prisma.chat.create({
            data: {
                members: { connect: [{ id: req.user.id }, { id: receiver_id }] },
                messages: { create: { sender_id: req.user.id, content: msg } }
            }
        });

        return res.status(201).json({ chat, msg: `chat created successfullly` });
    }
    catch (err) {
        return res.status(500).json({ msg: err || `unknown server error` })
    }
}
const getUserChats = async (req, res) => {
    try {
        const usserChats = await prisma.chat.findMany({ where: { members: { some: { id: req.user.id } } }, include: { members: { where: { NOT: { id: req.user.id } } } } });
        return res.status(200).json({ chats: usserChats })
    }
    catch (err) {
        return res.status(500).json({ msg: err || `unknown server error` })
    }
}
const getUserChat = async (req, res) => {
    try {
        const chat = await prisma.chat.findUnique({ where: { id: req.params.chat_id, members: { some: { id: req.user.id } } }, include: { messages: { include: { sender: true }, orderBy: { createdAt: 'desc' } }, members: { where: { NOT: { id: req.user.id } } } } });
        if (!chat) return res.status(404).json({ msg: `chat not found` });
        return res.status(200).json({ chat })
    }
    catch (err) {
        return res.status(500).json({ msg: err || `unknown server error` });
    }

}
const deleteChat = async (req, res) => {
    const { chat_id } = req.params;
    try {

        const chat = await prisma.chat.findFirst({ where: { AND: { id: chat_id, members: { some: { id: req.user.id } } } } });
        if (!chat) return res.status(404).json({ msg: `can not found chat` })
        await prisma.chat.delete({ where: { id: chat_id } });
        return res.status(200).json({ msg: `chat ${chat.id} deleted` })
    }
    catch (err) {
        return res.status(500).json({ msg: err || `unknown server error` })
    }
}
export {
    createChat, deleteChat, getUserChat, getUserChats
}