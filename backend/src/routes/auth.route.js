import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// General authentication check endpoint
router.get('/check', protectRoute, (req, res) => {
    res.status(200).json({
        authenticated: true,
        user: req.user,
        role: req.user.role
    });
});

// Check if user profile is complete
router.get('/profile-status', protectRoute, (req, res) => {
    const user = req.user;
    let isComplete = false;
    
    if (user.role === 'client') {
        // Check if client has completed onboarding (state is required)
        isComplete = !!(user.state);
    } else if (user.role === 'advocate') {
        // Check if advocate has completed onboarding
        isComplete = !!(user.lawFirm && user.barCouncilNumber && user.specialization);
    }
    
    res.status(200).json({
        authenticated: true,
        user: req.user,
        role: user.role,
        profileComplete: isComplete
    });
});

export default router;