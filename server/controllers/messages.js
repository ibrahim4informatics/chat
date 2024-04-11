import prisma from '../conf/db.js';
const sendMessage = async (req, res) => {
    const { chat_id, content } = req.body;
    const sender_id = req.user.id;
    if (!chat_id || !content) return res.status(400).json({ msg: 'missing data' });
    try {
        const chat = await prisma.chat.findUnique({ where: { id: chat_id, members: { some: { id: sender_id } } } });
        if (!chat) return res.status(404).json({ msg: `chat not found` });
        const message = await prisma.message.create({ data: { content, sender_id, chat_id } });
        return res.status(201).json({ msg: `message sent suceessfully`, message })
    }
    catch (err) {
        return res.status(500).json({ msg: err || `unknown server error` })
    }
}
const deleteMessage = async (req, res) => {
    const { message_id } = req.params;
    try {
        const message = await prisma.message.findUnique({ where: { id: message_id, sender_id: req.user.id } });
        if (!message) return res.status(404).json({ msg: `message can not be found` });
        await prisma.message.update({ where: { id: message_id }, data: { isDeleted: true } });
        return res.status(200).json({ msg: `message set to deleted successfully` })
    }
    catch (err) {
        return res.status(500).json({ msg: err || `unknown server error` })
    }
}

export {
    sendMessage, deleteMessage
}
