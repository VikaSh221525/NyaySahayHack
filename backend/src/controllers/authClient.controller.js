import clientModel from "../models/Client.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { upsertStreamUser, generateStreamToken } from "../db/stream.db.js";

export async function registerClient(req, res) {
    try {
        const { fullName, email, phone, password } = req.body;

        // Validate required fields
        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await clientModel.findOne({ 
            $or: [{ email }, { phone }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: "User already exists with this email or phone number" 
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new client
        const newClient = new clientModel({
            fullName,
            email,
            phone,
            password: hashedPassword,
            role: "client"
        });

        const savedClient = await newClient.save();

        // Create Stream user
        const streamUserData = {
            id: savedClient._id.toString(),
            name: fullName,
            role: "client",
            email: email
        };

        await upsertStreamUser(streamUserData);

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: savedClient._id, 
                email: savedClient.email,
                role: "client"
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Generate Stream token
        const streamToken = generateStreamToken(savedClient._id);

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Return user data (without password)
        const { password: _, ...clientData } = savedClient.toObject();

        res.status(201).json({
            message: "Client registered successfully",
            user: clientData,
            streamToken
        });

    } catch (error) {
        console.log("Error in register client", error);
        res.status(500).json({ message: "Internal server error" });
    }
} 

export async function loginClient(req, res) {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const client = await clientModel.findOne({ email });

        if (!client) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, client.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: client._id, 
                email: client.email,
                role: "client"
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Generate Stream token
        const streamToken = generateStreamToken(client._id);

        // Update Stream user (in case of any changes)
        const streamUserData = {
            id: client._id.toString(),
            name: client.fullName,
            role: "client",
            email: client.email
        };

        await upsertStreamUser(streamUserData);

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Return user data (without password)
        const { password: _, ...clientData } = client.toObject();

        res.status(200).json({
            message: "Login successful",
            user: clientData,
            streamToken
        });

    } catch (error) {
        console.log("Error in login client", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function logoutClient(req, res) {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout client", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function onboardingClient(req, res) {
    try {
        const userId = req.user._id;
        const { state, description, address } = req.body;

        // Validate required fields
        if (!state) {
            return res.status(400).json({ message: "State is required" });
        }

        // Prepare update data
        const updateData = {
            state,
            description: description || "",
            address: address || ""
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
        const updatedClient = await clientModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedClient) {
            return res.status(404).json({ message: "Client not found" });
        }

        // Update Stream user with new profile data
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
        console.log("Error in client onboarding", error);
        res.status(500).json({ message: "Internal server error" });
    }
}