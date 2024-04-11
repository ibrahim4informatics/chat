import { verifyToken } from '../utils/token.util.js';
export default async (req, res, next) => {
    if (!req.headers.authorization) {
        if (!req.user) return res.status(401).json({ msg: 'not authenticated' });
        else {
            next();
        }
    }
    else {
        try {
            const token = (req.headers.authorization).split(" ")[1]
            const payload = await verifyToken(token, process.env.SECRETA);
            if(payload === -1) return res.status(401).json({msg: 'expired token'})
            req.user = payload
            next()
        }
        catch {
            return res.status(401).json({ msg: 'not authenticated' })
        }
    }
}