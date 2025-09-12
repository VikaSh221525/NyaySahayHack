import mongoose from "mongoose";

const clientSchema = mongoose.Schema({
    fullName: {type: String, required: true},
    email : {type: String, required: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: "client"},
    profilePicture: String, 
    address: String,
    idProof: String,
    state: String,
    description: String,
    
},  {timestamps: true})

const clientModel = mongoose.model("client", clientSchema);
export default clientModel;