import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'userType'
    },
    userType: {
        type: String,
        required: true,
        enum: ['client', 'Advocate'] // Note: 'Advocate' matches your model name
    },
    title: {
        type: String,
        required: true
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;