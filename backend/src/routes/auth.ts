import express from 'express';
import { register, verifyOTP, login, requestPasswordReset, resetPassword, resendOTP } from '../controllers/authController';

const router = express.Router();

router.post('/register', async (req, res) => {
    await register(req, res);
});


router.post('/verify-otp', async (req, res) => {
    await verifyOTP(req, res);
});


router.post('/resend-otp', async (req, res) => {
    await resendOTP(req, res);
});


router.post('/login', async (req, res) => {
    await login(req, res);
});


router.post('/forgot-password', async (req, res) => {
    await requestPasswordReset(req, res);
});


router.post('/reset-password', async (req, res) => {
    await resetPassword(req, res); 
});

export default router;
