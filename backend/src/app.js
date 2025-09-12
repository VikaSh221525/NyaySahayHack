import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authClientRoutes from "./routes/authClient.route.js"
import authAdvocateRoutes from "./routes/authAdvocate.route.js"
import authRoutes from "./routes/auth.route.js"

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,  
}))

app.use('/api/auth', authClientRoutes)
app.use('/api/auth', authAdvocateRoutes)
app.use('/api/auth', authRoutes)

export default app;