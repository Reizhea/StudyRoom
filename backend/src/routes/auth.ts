import express from 'express';
import { register, verifyOTP, login, requestPasswordReset, resetPassword, resendOTP, finalizeRegistration, getUserProfile, updateUserProfile} from '../controllers/authController';
import { authenticateToken } from '../middlewares/authenticateToken';

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

router.post("/finalize-registration", async (req, res) => {
    await finalizeRegistration(req, res);
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

router.get("/check-auth", authenticateToken, (req, res) => {
    const user = (req as any).authUser;
  
    if (user) {
      res.status(200).json({ isAuthenticated: true, user });
    } else {
      res.status(401).json({ isAuthenticated: false });
    }
});

router.get("/profile", authenticateToken, async (req, res) => {
    await getUserProfile(req, res);
  });
  
  router.put("/profile", authenticateToken, async (req, res) => {
    await updateUserProfile(req, res);
  });
  
export default router;
