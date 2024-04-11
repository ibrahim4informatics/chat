import prisma from '../conf/db.js'
const getUserProfile = async (req, res) => {
    // TODO[x]: getting user profile information

    try {
        const { id } = req.user;
        const user = await prisma.user.findUnique({ where: { id: id }, include: { Chats: { include: { members: {where:{NOT:{id}}} } } } })
        return res.status(200).json({ user })
    }
    catch (err) {
        return res.status(500).json({ msg: err || `unknown server error` })
    }


}

const searchForUserByUsername = async (req, res) => {
    //TODO: search users by username
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        const usernameSearched = req.query.username;
        const results = await prisma.user.findMany({ where: { username: { not: user.username, contains: usernameSearched } } });
        return res.status(200).json({ results });
    }
    catch (err) {
        return res.status(500).json({ msg: err || `unknown server error` })
    }
}

const setUserActive = async (req, res) => {
    try {
        await prisma.user.update({ where: { id: req.user.id }, data: { isActive: true } });
        return res.status(200).json({ msg: `user is active now!` });

    }
    catch (err) {
        return res.status(500).json({ msg: err || `unkown server error` })
    }

}
const setUserInActive = async (req, res) => {
    try {
        await prisma.user.update({ where: { id: req.user.id }, data: { isActive: false } });
        return res.status(200).json({ msg: `user is inactive now!` });

    }
    catch (err) {
        return res.status(500).json({ msg: err || `unkown server error` })
    }
}
const deleteUser = async (req, res) => {
    //TODO: delete user profile
    try {
        await prisma.user.delete({ where: { id: req.user.id } });
        return res.status(200).json({ msg: `user deleted` })

    }
    catch (err) {
        return res.status(500).json({ msg: err || `unknown server error` })
    }
}


export {
    getUserProfile, searchForUserByUsername, setUserActive, setUserInActive, deleteUser
}
