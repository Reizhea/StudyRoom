import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import User from '../models/User';
import { EMAIL_USER, EMAIL_PASS } from '../config';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

// Temporary store for OTPs and user registration details
const otpStore = new Map<
    string,
    {
        username: string;
        password: string;
        otp: string;
        resendTimeout: NodeJS.Timeout | null;
        expireTimeout: NodeJS.Timeout;
    }
>();

// Generate OTP
const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});


export const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: 'Username is taken' });
        }

        const otp = generateOTP();

        const existingOtp = otpStore.get(email);
        if (existingOtp) {
            if (existingOtp.resendTimeout) {
                return res.status(429).json({ error: 'Please wait 1 minute before resending OTP' });
            }
            clearTimeout(existingOtp.expireTimeout);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const resendTimeout = setTimeout(() => {
            otpStore.set(email, { ...otpStore.get(email)!, resendTimeout: null });
        }, 60 * 1000);

        const expireTimeout = setTimeout(() => {
            otpStore.delete(email);
        }, 10 * 60 * 1000);

        otpStore.set(email, {
            username,
            password: hashedPassword,
            otp,
            resendTimeout,
            expireTimeout,
        });

        await transporter.sendMail({
            from: EMAIL_USER,
            to: email,
            subject: 'StudyRoom OTP Verification',
            text: `Your OTP is: ${otp}`,
        });

        res.status(201).json({ message: 'OTP sent to your email' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
};


export const verifyOTP = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    try {
        const otpDetails = otpStore.get(email);

        if (!otpDetails || otpDetails.otp !== otp) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        if (!otpDetails.username && !otpDetails.password) {
            clearTimeout(otpDetails.expireTimeout);
            otpStore.delete(email);
            return res.status(200).json({ message: 'OTP verified successfully!' });
        }

        const username = otpDetails.username;
        const password = otpDetails.password;

        if (!username || !password) {
            return res.status(400).json({ error: 'Missing user details in OTP verification' });
        }

        const newUser = new User({ email, username, password });
        await newUser.save();

        clearTimeout(otpDetails.expireTimeout);
        otpStore.delete(email);

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        console.error('Error verifying OTP:', err);
        res.status(500).json({ error: 'OTP verification failed' });
    }
};


export const resendOTP = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const otpDetails = otpStore.get(email);

        if (!otpDetails) {
            return res.status(400).json({ error: 'No OTP found for this email. Register again.' });
        }

        if (otpDetails.resendTimeout) {
            return res.status(429).json({ error: 'Please wait 1 minute before resending OTP' });
        }

        const otp = generateOTP();

        clearTimeout(otpDetails.expireTimeout);
        const resendTimeout = setTimeout(() => {
            otpStore.set(email, { ...otpDetails, resendTimeout: null });
        }, 60 * 1000);

        const expireTimeout = setTimeout(() => {
            otpStore.delete(email);
        }, 10 * 60 * 1000);

        otpStore.set(email, { username: otpDetails.username, password: otpDetails.password, otp, resendTimeout, expireTimeout });
;
        await transporter.sendMail({
            from: EMAIL_USER,
            to: email,
            subject: 'StudyRoom OTP Verification (Resent)',
            text: `Your new OTP is: ${otp}`,
        });

        res.status(200).json({ message: 'OTP resent to your email' });
    } catch (err) {
        console.error('Error resending OTP:', err);
        res.status(500).json({ error: 'Resend OTP failed' });
    }
};


export const requestPasswordReset = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const otp = generateOTP();

        const resendTimeout = setTimeout(() => {
            otpStore.set(email, { ...otpStore.get(email)!, resendTimeout: null });
        }, 60 * 1000);

        const expireTimeout = setTimeout(() => {
            otpStore.delete(email);
        }, 10 * 60 * 1000);

        otpStore.set(email, { username: '', password: '', otp, resendTimeout, expireTimeout });

        await transporter.sendMail({
            from: EMAIL_USER,
            to: email,
            subject: 'StudyRoom Password Reset',
            text: `Your OTP for resetting your password is: ${otp}`,
        });

        res.status(200).json({ message: 'Password reset OTP sent to your email' });
    } catch (err) {
        console.error('Error requesting password reset:', err);
        res.status(500).json({ error: 'Password reset request failed' });
    }
};


export const resetPassword = async (req: Request, res: Response) => {
    const { email, newPassword, isLoggedIn } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ error: 'Email and new password are required' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({ error: 'Password reset failed.' });
    }
};



export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }   

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Login failed' });
    }
};
