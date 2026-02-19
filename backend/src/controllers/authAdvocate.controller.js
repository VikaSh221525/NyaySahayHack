import advocateModel from "../models/Advocate.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { upsertStreamUser, generateStreamToken } from "../db/stream.db.js";

export async function registerAdvocate(req, res) {
    try {
        const { fullName, email, phone, password } = req.body;

        // Validate required fields
        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if advocate already exists
        const existingAdvocate = await advocateModel.findOne({ 
            $or: [{ email }, { phone }] 
        });

        if (existingAdvocate) {
            return res.status(400).json({ 
                message: "Advocate already exists with this email or phone number" 
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new advocate
        const newAdvocate = new advocateModel({
            fullName,
            email,
            phone,
            password: hashedPassword,
            role: "advocate"
        });

        const savedAdvocate = await newAdvocate.save();

        // Create Stream user
        const streamUserData = {
            id: savedAdvocate._id.toString(),
            name: fullName,
            role: "advocate",
            email: email
        };

        await upsertStreamUser(streamUserData);

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: savedAdvocate._id, 
                email: savedAdvocate.email,
                role: "advocate"
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Generate Stream token
        const streamToken = generateStreamToken(savedAdvocate._id);

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Return advocate data (without password)
        const { password: _, ...advocateData } = savedAdvocate.toObject();

        res.status(201).json({
            message: "Advocate registered successfully",
            user: advocateData,
            streamToken
        });

    } catch (error) {
        console.log("Error in register advocate", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function loginAdvocate(req, res) {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find advocate by email
        const advocate = await advocateModel.findOne({ email });

        if (!advocate) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, advocate.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: advocate._id, 
                email: advocate.email,
                role: "advocate"
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Generate Stream token
        const streamToken = generateStreamToken(advocate._id);

        // Update Stream user (in case of any changes)
        const streamUserData = {
            id: advocate._id.toString(),
            name: advocate.fullName,
            role: "advocate",
            email: advocate.email,
            image: advocate.profilePicture || undefined
        };

        await upsertStreamUser(streamUserData);

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Return advocate data (without password)
        const { password: _, ...advocateData } = advocate.toObject();

        res.status(200).json({
            message: "Login successful",
            user: advocateData,
            streamToken
        });

    } catch (error) {
        console.log("Error in login advocate", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function logoutAdvocate(req, res) {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout advocate", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function onboardingAdvocate(req, res) {
    try {
        const userId = req.user._id;
        const { 
            lawFirm, 
            barCouncilNumber, 
            yearsOfPractice, 
            specialization, 
            location, 
            bio 
        } = req.body;

        // Validate required fields
        if (!lawFirm || !barCouncilNumber || !yearsOfPractice || !specialization || !location) {
            return res.status(400).json({ 
                message: "Law firm, bar council number, years of practice, specialization, and location are required" 
            });
        }

        // Check if bar council number is already taken by another advocate
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

            // Handle bar certificate upload
            if (req.files.barCertificate && req.files.barCertificate[0]) {
                try {
                    const barCertResult = await uploadFile(
                        req.files.barCertificate[0], 
                        'NyaySahay/advocates/certificates'
                    );
                    updateData.barCertificate = barCertResult.url;
                } catch (uploadError) {
                    console.error("Bar certificate upload error:", uploadError);
                    return res.status(400).json({ 
                        message: "Failed to upload bar certificate" 
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
        console.log("Error in advocate onboarding", error);
        res.status(500).json({ message: "Internal server error" });
    }
}