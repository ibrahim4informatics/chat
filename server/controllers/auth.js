import { isEmail, isUsername, isStrongPassword } from "../utils/validation.js";
import prisma from '../conf/db.js';
import bcrypt from 'bcrypt';
import { generateTokens, verifyToken } from "../utils/token.util.js";
import jwt from 'jsonwebtoken';
const registerByemail = async (req, res) => {
    const { username, email, password, confirm } = req.body
    if (!username || !email || !password) return res.status(400).json({ msg: "missing data" });
    if (!isEmail(email)) return res.status(400).json({ msg: 'invalid email' })
    if (!isUsername(username)) return res.status(400).json({ msg: 'invalid username' })
    if (!isStrongPassword(password)) return res.status(400).json({ msg: "invalid password" });
    if (password !== confirm) return res.status(400).json({ msg: `passwords doesn't matches` })

    try {

        let user = await prisma.user.findUnique({ where: { email } });
        if (user) return res.status(400).json({ msg: `email is used` });
        user = await prisma.user.findUnique({ where: { username } });
        if (user) return res.status(400).json({ msg: `username is used` })
        const newUser = await prisma.user.create({ data: { email, username, password: bcrypt.hashSync(password, 12) } });
        const { accessToken, refreshToken } = generateTokens({ id: newUser.id })
        res.cookie('refresh-token', refreshToken);
        return res.status(201).json({ msg: 'user creation success', accessToken })
    }
    catch (err) {

        return res.status(500).json({ msg: err || `unknown server error` })
    }
};

const loginByEmail = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password || !isEmail(email) || !isStrongPassword(password)) return res.status(400).json({ msg: "invalid email or password" })
    try {

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ msg: `invalid email or password` })
        if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ msg: `invalid email or password` });

        const { accessToken, refreshToken } = generateTokens({ id: user.id })
        res.cookie('refresh-token', refreshToken);
        return res.status(200).json({ msg: 'user login success', accessToken })

    }
    catch (err) {
        return res.status(500).json({ msg: err || `unknown server error` })
    }
}

const googleLoginRedirect = (req, res) => {
    return res.redirect('http://localhost:5173');
    //TODO: redirect user to the client url
}

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies['refresh-token'];
    if (!refreshToken) return res.status(401).json({ msg: `user not logged in` })
    try {
        const payload = await verifyToken(refreshToken, process.env.SECRETB);
        if (payload === -1) return res.status(401).json({ msg: 'expired token' });
        const accessToken = await jwt.sign({ id: payload.id }, process.env.SECRETA, { expiresIn: '15m' })
        return res.status(200).json({ accessToken })
    }
    catch {

        return res.status(401).json({ msg: `user not loged in` })
    }
}

const logoutUser = (req, res, next) => {
    const refreshTokenCookie = req.cookies['refresh-token'];
    if (!refreshTokenCookie) {
        req.logout(err => {
            if (err) return res.status(500).json({ msg: err })
        })
        return res.status(200).json({ msg: 'user logged out' });
    }
    else {
        res.cookie('refresh-token', null);
        return res.status(200).json({ msg: 'user logged out' })
    }
}
export {
    registerByemail, refreshToken, loginByEmail, logoutUser, googleLoginRedirect
}