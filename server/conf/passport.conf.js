import passport from "passport";
import prisma from './db.js'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


passport.serializeUser(function (user_id, done) {
    done(null, user_id)
})


passport.deserializeUser(async (id, done) => {
    done(null, { id })
})

passport.deserializeUser(function (user, done) { done(null, user) })

export default passport.use(new GoogleStrategy({
    clientID: process.env.G_CLIENT_ID,
    clientSecret: process.env.G_CLIENT_SECRET,
    callbackURL: '/api/auth/google/redirect',
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    // console.log(profile.emails)
    const user = await prisma.user.findUnique({ where: { google_id: profile.id } });
    if (!user) {
        
            const newUser = await prisma.user.create({ data: { google_id: profile.id, email: profile.emails[0].value, username: profile.emails[0].value.split('@')[0] } })
            done(null, newUser.id)
    }
    else {
        done(null, user.id)
    }

}))
