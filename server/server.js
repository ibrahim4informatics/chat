// import necessary packages
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cookieSession from 'cookie-session';
import passport from 'passport';
import _passportConf from './conf/passport.conf.js';
import csurf from 'csurf';


// importing routers
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import chatRouter from './routes/chat.js';
import messageRouter from './routes/messages.js';
// initilize app
dotenv.config()
const app = express();
const port = process.env.PORT
// to use cookie session
const regenerate = cb => { cb() }
const save = cb => { cb() }
// using midlewares needed
app.use(express.json());
// cors setup
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
// cookies and session setup
app.use(cookieParser());
app.use(cookieSession({ maxAge: 24 * 60 * 60 * 1000, keys: [process.env.SESSION] }));
// hundling csrf attack
// const antiCsrfToken = csurf({ cookie: true })
// app.use(antiCsrfToken)
// app.use((err, req, res, next) => {
//     if (err && err.code === 'EBADCSRFTOKEN') return res.status(403).json({ msg: 'invalid csrf token' })
//     next()
// }
// )
// app.get('/csrf-token', antiCsrfToken, (req, res) => {
//     return res.status(200).json({ csrfToken: req.csrfToken() })
// })
app.use(passport.initialize());
app.use((req, _res, next) => {
    req.session.regenerate = regenerate;
    req.session.save = save;
    next();
})
app.use(passport.session())
app.use(helmet({ hidePoweredBy: true }))

// using routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chats', chatRouter);
app.use('/api/messages', messageRouter);
app.all('*', (req, res) => {
    res.status(404).json({ msg: `route not found` })
})

// start the server
const server = app.listen(port, () => { console.log(`server is on http://localhost:${port}`) })
// websocket
import prisma from './conf/db.js'
export const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', async (client) => {
    // console.log(client.id)
    client.on('client', (data) => { console.log(data) })

    client.on('send', async (content, sender_id, chat_id) => {
        console.log(sender_id)
        try {
            await prisma.message.create({ data: { content, chat_id, sender_id } })
        }
        catch (err) {
            console.log(err)
        }
    })
    client.on('disconnect', () => {

        client.disconnect()


    })
})


