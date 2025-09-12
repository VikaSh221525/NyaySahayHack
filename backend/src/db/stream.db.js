import { StreamChat } from "stream-chat";
import "dotenv/config"

const api_key = process.env.STEAM_API_KEY;
const api_secret = process.env.STEAM_API_SECRET;
// instantiate your stream client using the API key and secret
// the secret is only used server side and gives you full access to the API
const serverClient = StreamChat.getInstance(
    api_key, api_secret
);

export const upsertStreamUser = async (userData) => {
    try{
        // upsert means => create or update depending on the case
        await serverClient.upsertUsers([userData]);
        return userData;
    }catch(err){
        console.error("Error in upsertStreamUser", err);
    }
}

export const generateStreamToken = (userId) => {
    try {
        // ensure userId is a string
        const userIdStr = String(userId);
        return serverClient.createToken(userIdStr);
    } catch (error) {
        console.error("Error in generateStreamToken", error);
        
    }
}