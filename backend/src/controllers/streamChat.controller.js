import { generateStreamToken } from "../db/stream.db.js";

export async function getStreamToken(req, res){
    try{
        const token = generateStreamToken(req.user._id);
        res.status(200).json({token})
    }catch(err){
        console.error("Error in getting stream token", err.message);
        res.status(500).json({error: "Internal server error"})
    }

}