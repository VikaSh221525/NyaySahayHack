import chatModel from "../models/Chat.model.js";
import messageModel from "../models/message.model.js";

export async function createChat(req, res) {
    try {
        const { title } = req.body;
        const user = req.user;

        if (!title || title.trim().length === 0) {
            return res.status(400).json({
                message: "Title is required and cannot be empty"
            });
        }

        // Determine user type based on role
        const userType = user.role === "client" ? "client" : "Advocate";

        const chat = await chatModel.create({
            user: user._id,
            userType: userType,
            title: title.trim()
        });

        res.status(201).json({
            message: "Chat created successfully",
            chat: {
                _id: chat._id,
                title: chat.title,
                lastActivity: chat.lastActivity,
                user: chat.user,
                userType: chat.userType
            }
        });
    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json({
            message: "Internal server error while creating chat"
        });
    }
}

export async function getChats(req, res) {
    try {
        const user = req.user;

        const chats = await chatModel.find({ user: user._id }).sort({ lastActivity: -1 });

        res.status(200).json({
            message: "Chats retrieved successfully",
            chats: chats.map(chat => ({
                _id: chat._id,
                title: chat.title,
                lastActivity: chat.lastActivity,
                user: chat.user,
                userType: chat.userType,
                createdAt: chat.createdAt
            }))
        });
    } catch (error) {
        console.error("Error retrieving chats:", error);
        res.status(500).json({
            message: "Internal server error while retrieving chats"
        });
    }
}

export async function getMessages(req, res) {
    try {
        const chatId = req.params.id;
        const user = req.user;

        // Verify that the chat belongs to the user
        const chat = await chatModel.findOne({ _id: chatId, user: user._id });
        
        if (!chat) {
            return res.status(404).json({
                message: "Chat not found or access denied"
            });
        }

        const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

        res.status(200).json({
            message: "Messages retrieved successfully",
            messages: messages.map(msg => ({
                _id: msg._id,
                content: msg.content,
                role: msg.role,
                createdAt: msg.createdAt,
                user: msg.user,
                userType: msg.userType
            }))
        });
    } catch (error) {
        console.error("Error retrieving messages:", error);
        res.status(500).json({
            message: "Internal server error while retrieving messages"
        });
    }
}

export async function deleteChat(req, res) {
    try {
        const chatId = req.params.id;
        const user = req.user;

        // Verify that the chat belongs to the user
        const chat = await chatModel.findOne({ _id: chatId, user: user._id });
        
        if (!chat) {
            return res.status(404).json({
                message: "Chat not found or access denied"
            });
        }

        // Delete all messages in the chat
        await messageModel.deleteMany({ chat: chatId });
        
        // Delete the chat
        await chatModel.findByIdAndDelete(chatId);

        res.status(200).json({
            message: "Chat deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting chat:", error);
        res.status(500).json({
            message: "Internal server error while deleting chat"
        });
    }
}