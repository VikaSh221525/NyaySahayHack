import { Server } from 'socket.io';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import clientModel from "../models/Client.model.js";
import advocateModel from "../models/Advocate.model.js";
import { generateResponse, generateVector } from "../service/ai.service.js";
import messageModel from "../models/message.model.js";
import { createMemory, queryMemory } from "../service/vector.seervice.js";

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: [
                process.env.FRONTEND_URL,
                "https://nyay-sahay-hack-sooty.vercel.app",
                "http://localhost:5173" // Keep for local development
            ],
            credentials: true
        }
    });

    // Socket.io middleware for authentication
    io.use(async (socket, next) => {
        try {
            const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
            
            if (!cookies.token) {
                return next(new Error("Authentication Error: No token provided"));
            }

            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
            
            let user = null;
            let userType = null;

            // Check user role and find in appropriate model
            if (decoded.role === "client") {
                user = await clientModel.findById(decoded.userId).select("-password");
                userType = "client";
            } else if (decoded.role === "advocate") {
                user = await advocateModel.findById(decoded.userId).select("-password");
                userType = "Advocate";
            }

            if (!user) {
                return next(new Error("User not found"));
            }

            socket.user = user;
            socket.userType = userType;
            next();

        } catch (err) {
            console.error("Socket authentication error:", err);
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`${socket.userType} connected: ${socket.user.fullName}`);
        
        socket.on("ai-message", async (messagePayload) => {
            try {
                // Save user message and generate vector
                const [message, vectors] = await Promise.all([
                    messageModel.create({
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        userType: socket.userType,
                        content: messagePayload.content,
                        role: "user"
                    }),
                    generateVector(messagePayload.content)
                ]);

                // Store in vector memory
                await createMemory({
                    vectors,
                    messageId: message._id,
                    metadata: {
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        userType: socket.userType,
                        text: messagePayload.content
                    }
                });

                // Get relevant memory and recent chat history
                const [memory, recentMessages] = await Promise.all([
                    queryMemory({
                        queryVector: vectors,
                        limit: 5,
                        metadata: {
                            user: socket.user._id
                        }
                    }),
                    messageModel.find({
                        chat: messagePayload.chat
                    }).sort({ createdAt: -1 }).limit(20).lean()
                ]);

                const chatHistory = recentMessages.reverse();

                // Build conversation history for AI
                const conversationHistory = chatHistory.map(item => ({
                    role: item.role,
                    parts: [{ text: item.content }]
                }));

                // Build context from long-term memory
                const ltmContext = memory.map(item => item.metadata.text).join('\n');

                // Create system instruction with legal context
                const userRole = socket.userType === "client" ? "citizen" : "legal professional";
                const systemInstruction = `<|context|>
You are JusticeAI, an AI legal assistant for NyaySahay platform. The user is a ${userRole}.

Relevant information from past conversations:
${ltmContext}
<|/context|>

<|conversation|>`;

                // Prepare final prompt
                const finalPrompt = [...conversationHistory];
                if (finalPrompt.length > 0 && finalPrompt[0].role === 'user') {
                    finalPrompt[0].parts[0].text = `${systemInstruction}\n${finalPrompt[0].parts[0].text}`;
                } else {
                    finalPrompt.unshift({ 
                        role: 'user', 
                        parts: [{ text: systemInstruction }] 
                    });
                }

                // JusticeAI Persona - Legal Assistant
                const justiceAIPersona = `You are JusticeAI ⚖️, an intelligent legal assistant for the NyaySahay platform. Your mission is to help citizens understand their legal rights and provide guidance on legal matters in India.

**Your Role:**
- Provide clear, accurate legal information based on Indian law
- Help users understand their constitutional rights
- Guide users on legal procedures and remedies
- Explain legal concepts in simple, understandable language
- Suggest appropriate legal actions when needed

**Guidelines:**
- Always clarify that you provide legal information, not legal advice
- Recommend consulting with qualified advocates for specific legal matters
- Be empathetic and supportive, especially for victims of injustice
- Use simple language and avoid complex legal jargon
- Provide step-by-step guidance when explaining procedures
- Include relevant legal sections/acts when applicable
- Be culturally sensitive and aware of Indian legal context

**For Clients:** Help them understand their rights, legal options, and connect them with advocates
**For Advocates:** Provide legal research assistance, case law references, and procedural guidance

Always be professional, helpful, and encouraging. Use appropriate emojis to make interactions friendly but maintain the seriousness of legal matters. 🏛️⚖️`;

                // Generate AI response
                const response = await generateResponse(finalPrompt, justiceAIPersona);

                // Send response to client
                socket.emit('ai-response', {
                    content: response,
                    chat: messagePayload.chat
                });

                // Save AI response and create memory
                const [responseMessage, responseVectors] = await Promise.all([
                    messageModel.create({
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        userType: socket.userType,
                        content: response,
                        role: "model"
                    }),
                    generateVector(response)
                ]);

                await createMemory({
                    vectors: responseVectors,
                    messageId: responseMessage._id,
                    metadata: {
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        userType: socket.userType,
                        text: response
                    }
                });

            } catch (err) {
                console.error("Error processing AI message:", err);
                socket.emit('ai-error', { 
                    message: "I apologize, but I encountered an error. Please try again." 
                });
            }
        });

        socket.on("disconnect", () => {
            console.log(`${socket.userType} disconnected: ${socket.user.fullName}`);
        });
    });
}

export default initSocketServer;