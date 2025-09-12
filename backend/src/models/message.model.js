import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'userType'
    },
    userType: {
        type: String,
        required: true,
        enum: ['client', 'Advocate']
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "model"],
        default: "user"
    }
}, { timestamps: true });

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;
