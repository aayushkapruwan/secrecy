
import mongoose from "mongoose";
export interface messageType extends mongoose.Document {
    content: string,
    createdAt: Date
}
export interface userType extends mongoose.Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean
    isAcceptingMessage: boolean,
    messages: messageType[]
}
const messageSchema: mongoose.Schema<messageType> = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now()
        }
    }
)


const userSchema: mongoose.Schema<userType> = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "username required"],
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: [true, "email required"],
            unique: true,
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "please enter correct emial"]
        },
        password: {
            type: String,
            required: [true, "password required"],
        },
        verifyCode: {
            type: String,
            required: [true, "verifyCode required"],
        },
        verifyCodeExpiry: {
            type: Date,
            required: [true, "verifyCodeExpiry required"],
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isAcceptingMessage: {
            type: Boolean,
            default: true
        },
        messages: {
            type: [messageSchema],

        }
    }
)
// const Message = (mongoose.models.Message as mongoose.Model<messageType>) || mongoose.model<messageType>("Message", messageSchema);
const User = (mongoose.models.User as mongoose.Model<userType>) || mongoose.model<userType>("User", userSchema);
export { User };
