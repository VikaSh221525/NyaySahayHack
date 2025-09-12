import userModel from "../models/User.model.js";
import jwt from "jsonwebtoken";

export async function protectRoute(req, res, next){
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({message: "Unauthorized User"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId).select("-password");

        req.user = user;
        next();
    }catch(err){
        console.log("Unauthorized", err);
        return res.status(401).json({message: "Invalid or expired token"});
    }
}