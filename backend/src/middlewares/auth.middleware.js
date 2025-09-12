import clientModel from "../models/Client.model.js";
import advocateModel from "../models/Advocate.model.js";
import jwt from "jsonwebtoken";

export async function protectRoute(req, res, next) {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized User" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        let user = null;
        
        // Check user role and find in appropriate model
        if (decoded.role === "client") {
            user = await clientModel.findById(decoded.userId).select("-password");
        } else if (decoded.role === "advocate") {
            user = await advocateModel.findById(decoded.userId).select("-password");
        }

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.log("Unauthorized", err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}