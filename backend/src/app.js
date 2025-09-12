import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authClientRoutes from "./routes/authClient.route.js"

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,  
}))

app.use('/api/auth', authClientRoutes)
export default app;