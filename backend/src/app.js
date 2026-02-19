import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authClientRoutes from "./routes/authClient.route.js";
import authAdvocateRoutes from "./routes/authAdvocate.route.js";
import authRoutes from "./routes/auth.route.js";
import chatRouter from "./routes/chat.route.js";
import incidentRoutes from "./routes/incident.route.js";
import advocateClientRoutes from "./routes/advocateClient.route.js";
import streamChatRoutes from "./routes/Streamchat.route.js";

const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        "https://nyay-sahay-hack-sooty.vercel.app"
    ],
    credentials: true,  
}));

// Authentication routes
app.use('/api/auth', authClientRoutes);
app.use('/api/auth', authAdvocateRoutes);
app.use('/api/auth', authRoutes);

// Feature routes
app.use('/api/chat', chatRouter);
app.use('/api/incidents', incidentRoutes);
app.use('/api/connections', advocateClientRoutes);
app.use('/api/stream', streamChatRoutes);

export default app;