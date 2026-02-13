import express from "express";
import { loginClient, registerClient, logoutClient, onboardingClient } from "../controllers/authClient.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { uploadFiles } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post('/login/client', loginClient);
router.post('/signup/client', registerClient);
router.post('/logout/client', logoutClient);
router.put('/onboarding/client', protectRoute, uploadFiles, onboardingClient);

router.get('/me/client', protectRoute, (req, res) => {
    // Only allow clients to access this endpoint
    if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Access denied. Client role required.' });
    }
    res.status(200).json({ 
        user: req.user,
        authenticated: true,
        role: 'client'
    });
})

// Update client profile
router.put('/profile/client', protectRoute, uploadFiles, async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Only allow clients to update their profile
        if (req.user.role !== 'client') {
            return res.status(403).json({ message: 'Access denied. Client role required.' });
        }

        const { address, description } = req.body;

        // Prepare update data (only editable fields)
        const updateData = {
            address: address || req.user.address || "",
            description: description || req.user.description || ""
        };

        // Handle file uploads if present
        if (req.files) {
            const { uploadFile } = await import("../service/storage.service.js");

            // Handle profile picture upload
            if (req.files.profilePicture && req.files.profilePicture[0]) {
                try {
                    const profilePicResult = await uploadFile(
                        req.files.profilePicture[0], 
                        'NyaySahay/profiles'
                    );
                    updateData.profilePicture = profilePicResult.url;
                } catch (uploadError) {
                    console.error("Profile picture upload error:", uploadError);
                    return res.status(400).json({ 
                        message: "Failed to upload profile picture" 
                    });
                }
            }

            // Handle ID proof upload
            if (req.files.idProof && req.files.idProof[0]) {
                try {
                    const idProofResult = await uploadFile(
                        req.files.idProof[0], 
                        'NyaySahay/documents'
                    );
                    updateData.idProof = idProofResult.url;
                } catch (uploadError) {
                    console.error("ID proof upload error:", uploadError);
                    return res.status(400).json({ 
                        message: "Failed to upload ID proof" 
                    });
                }
            }
        }

        // Update client profile
        const clientModel = (await import("../models/Client.model.js")).default;
        const updatedClient = await clientModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedClient) {
            return res.status(404).json({ message: "Client not found" });
        }

        // Update Stream user with new profile data
        const { upsertStreamUser } = await import("../db/stream.db.js");
        const streamUserData = {
            id: updatedClient._id.toString(),
            name: updatedClient.fullName,
            role: "client",
            email: updatedClient.email,
            image: updatedClient.profilePicture || undefined
        };

        await upsertStreamUser(streamUserData);

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedClient
        });

    } catch (error) {
        console.log("Error in updating client profile", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;