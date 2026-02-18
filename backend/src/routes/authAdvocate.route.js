import express from "express";
import { loginAdvocate, registerAdvocate, logoutAdvocate, onboardingAdvocate } from "../controllers/authAdvocate.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { uploadFiles } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post('/login/advocate', loginAdvocate);
router.post('/signup/advocate', registerAdvocate);
router.post('/logout/advocate', logoutAdvocate);
router.put('/onboarding/advocate', protectRoute, uploadFiles, onboardingAdvocate);

router.get('/me/advocate', protectRoute, (req, res) => {
    // Only allow advocates to access this endpoint
    if (req.user.role !== 'advocate') {
        return res.status(403).json({ message: 'Access denied. Advocate role required.' });
    }
    res.status(200).json({ 
        user: req.user,
        authenticated: true,
        role: 'advocate'
    });
})

// Update advocate profile
router.put('/profile/advocate', protectRoute, uploadFiles, async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Only allow advocates to update their profile
        if (req.user.role !== 'advocate') {
            return res.status(403).json({ message: 'Access denied. Advocate role required.' });
        }

        const { lawFirm, barCouncilNumber, yearsOfPractice, specialization, location, bio } = req.body;

        // Validate required fields
        if (!lawFirm || !barCouncilNumber || !yearsOfPractice || !specialization || !location) {
            return res.status(400).json({ 
                message: "Law firm, bar council number, years of practice, specialization, and location are required" 
            });
        }

        // Check if bar council number is already taken by another advocate
        const advocateModel = (await import("../models/Advocate.model.js")).default;
        const existingAdvocate = await advocateModel.findOne({ 
            barCouncilNumber, 
            _id: { $ne: userId } 
        });

        if (existingAdvocate) {
            return res.status(400).json({ 
                message: "Bar council number already exists" 
            });
        }

        // Prepare update data
        const updateData = {
            lawFirm,
            barCouncilNumber,
            yearsOfPractice: parseInt(yearsOfPractice),
            specialization,
            location,
            bio: bio || ""
        };

        // Handle file uploads if present
        if (req.files) {
            const { uploadFile } = await import("../service/storage.service.js");

            // Handle profile picture upload
            if (req.files.profilePicture && req.files.profilePicture[0]) {
                try {
                    const profilePicResult = await uploadFile(
                        req.files.profilePicture[0], 
                        'NyaySahay/advocates/profiles'
                    );
                    updateData.profilePicture = profilePicResult.url;
                } catch (uploadError) {
                    console.error("Profile picture upload error:", uploadError);
                    return res.status(400).json({ 
                        message: "Failed to upload profile picture" 
                    });
                }
            }
        }

        // Update advocate profile
        const updatedAdvocate = await advocateModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedAdvocate) {
            return res.status(404).json({ message: "Advocate not found" });
        }

        // Update Stream user with new profile data
        const { upsertStreamUser } = await import("../db/stream.db.js");
        const streamUserData = {
            id: updatedAdvocate._id.toString(),
            name: updatedAdvocate.fullName,
            role: "advocate",
            email: updatedAdvocate.email,
            image: updatedAdvocate.profilePicture || undefined
        };

        await upsertStreamUser(streamUserData);

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedAdvocate
        });

    } catch (error) {
        console.log("Error in updating advocate profile", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;