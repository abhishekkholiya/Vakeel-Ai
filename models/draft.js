// MessageSchema.js
import mongoose from "mongoose";

const DraftSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    category:{type:String}
    
}, { timestamps: true });

module.exports =  mongoose.models.Draft || mongoose.model('Draft',DraftSchema);
