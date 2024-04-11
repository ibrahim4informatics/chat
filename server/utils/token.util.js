import jwt from 'jsonwebtoken'
const generateTokens = (payload) => {
    try {
        const refreshToken = jwt.sign(payload, process.env.SECRETB, { expiresIn: '3d' });
        const accessToken = jwt.sign(payload, process.env.SECRETA, { expiresIn: '15m' });
        return { accessToken, refreshToken }
    }
    catch {
        return -1
    }
}

const verifyToken = async (token, secret)=>{
    try {
        const payload = await jwt.verify(token, secret);
        return payload
    }
    catch {
        return -1
    }
}

export {generateTokens, verifyToken}