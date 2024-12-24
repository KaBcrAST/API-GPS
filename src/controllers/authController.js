import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthController {
    async registerUser(req, res) {
        const { username, email, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, email, password: hashedPassword });
            await newUser.save();
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error registering user', error });
        }
    }

    async loginUser(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error });
        }
    }

    async logoutUser(req, res) {
        req.logout();
        res.status(200).json({ message: 'User logged out successfully' });
    }

    async googleAuth(req, res) {
        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
    }

    async googleAuthCallback(req, res) {
        passport.authenticate('google', { failureRedirect: '/login' })(req, res, async () => {
            const { user } = req;
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.redirect(`http://localhost:3000/oauth-redirect?token=${token}&name=${user.username}&email=${user.email}`);
        });
    }

    async facebookAuth(req, res) {
        passport.authenticate('facebook', { scope: ['email'] })(req, res);
    }

    async facebookAuthCallback(req, res) {
        passport.authenticate('facebook', { failureRedirect: '/login' })(req, res, () => {
            const { user } = req;
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.redirect(`http://localhost:3000/oauth-redirect?token=${token}&name=${user.username}&email=${user.email}`);
        });
    }
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google profile:', profile);
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
            });
            await user.save();
            console.log('New user created:', user);
        } else {
            console.log('User found:', user);
        }
        done(null, user);
    } catch (error) {
        console.error('Error in GoogleStrategy:', error);
        done(error, false);
    }
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/facebook/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ facebookId: profile.id });
        if (!user) {
            user = new User({ facebookId: profile.id, username: profile.displayName, email: profile.emails[0].value });
            await user.save();
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

export default new AuthController();