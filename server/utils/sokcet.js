import { io } from "../server";
import prisma from '../conf/db.js'
io.on('connection', (client) => {
    console.log(client.id)
    client.on('active', async (user_id) => {
        try {
            await prisma.user.update({ where: { id: user_id }, data: { isActive: true } })
        }
        catch (err) {
            console.log(err)
        }
    });

    client.on('send', async (content, sender_id, chat_id) => {
        try {
            await prisma.message.create({ data: { content, chat_id, sender_id } })
        }
        catch (err) {
            console.log(err)
        }
    })
})