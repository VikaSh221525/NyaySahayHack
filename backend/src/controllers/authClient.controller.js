import clientModel from "../models/Client.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerClient(req, res) {
    try {

        
    } catch (error) {
        console.log("Error in register user", err);
        res.status(500).json({ message: "Internal server error" })
    }
} 
export async function loginClient(req, res) {
    try {


    } catch (error) {
        console.log("Error in login user", err);
        res.status(500).json({ message: "Internal server error" })
    }
}