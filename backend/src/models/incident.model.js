import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    incidentDetails: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    reporterEmail: {
        type: String,
        required: true,
        trim: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client',
        required: true
    },
    evidenceFiles: [{
        url: String,
        type: {
            type: String,
            enum: ['image', 'video', 'document']
        },
        filename: String
    }],
    status: {
        type: String,
        enum: ['submitted', 'under_review', 'forwarded', 'resolved'],
        default: 'submitted'
    },
    incidentType: {
        type: String,
        enum: ['corruption', 'police_misconduct', 'government_negligence', 'fraud', 'other'],
        required: true
    },
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    emailSent: {
        type: Boolean,
        default: false
    },
    emailSentAt: Date,
    incidentNumber: {
        type: String,
        unique: true
    }
}, { timestamps: true });

// Generate incident number before saving
incidentSchema.pre('save', function (next) {
    if (!this.incidentNumber) {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.incidentNumber = `INC-${timestamp.slice(-6)}${random}`;
    }
    next();
});

const incidentModel = mongoose.model("Incident", incidentSchema);
export default incidentModel;