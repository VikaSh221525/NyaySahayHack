import mongoose from "mongoose";

const advocateSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "advocate" },

    // Professional details (filled during onboarding)
    lawFirm: String,
    barCouncilNumber: String,
    yearsOfPractice: Number,
    specialization: String,
    location: String,
    bio: String,
    profilePicture: String,
    barCertificate: String,
}, { timestamps: true });

const advocateModel = mongoose.model("Advocate", advocateSchema);

export default advocateModel;