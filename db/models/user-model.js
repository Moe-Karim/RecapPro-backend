import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    videos: [
        {
            videoId: { type: Schema.Types.ObjectId, auto: true },
            path: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        }
    ]
});

export const User = model("User", userSchema);
