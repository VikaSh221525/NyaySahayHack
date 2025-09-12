import mongoose from "mongoose";

const consultationRequestSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "client",
        required: true,
    },
    advocate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Advocate",
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    legalIssue: {
        type: String,
        enum: ['civil', 'criminal', 'corporate', 'family', 'property', 'labor', 'other'],
        required: true
    },
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    rejectionReason: {
        type: String,
        trim: true
    },
    acceptedAt: Date,
    rejectedAt: Date
}, { timestamps: true });

const ConsultationRequest = mongoose.model("ConsultationRequest", consultationRequestSchema);

export default ConsultationRequest;