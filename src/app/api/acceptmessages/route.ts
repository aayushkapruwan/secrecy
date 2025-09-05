import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/dbConnect";
import ApiResponseType from "@/types/ApiResponse";
export async function POST(req: NextRequest): Promise<NextResponse> {
    await connectToDatabase();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        const { acceptMessages } = await req.json();
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }
        const userid = new mongoose.Types.ObjectId(user._id);
        console.log(userid);
        
        const userExist = await User.findByIdAndUpdate(userid, {
            isAcceptingMessage: acceptMessages
        }, { new: true });
        if (!userExist) {
            return NextResponse.json({
                success: false,
                message: 'Unable to find user to update message acceptance status',
            },
                { status: 404 })
        }
        return NextResponse.json({
            success: true,
            message: 'Message acceptance status updated successfully',
            user: userExist
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Error updating message acceptance status',
            error: error
        }, { status: 500 })
    }
}
export async function GET(req: NextRequest): Promise<any> {
    await connectToDatabase();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }
        const userid = new mongoose.Types.ObjectId(user._id);
        const userExist = await User.findById(userid);
        if (!userExist) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            isAcceptingMessage: userExist.isAcceptingMessage,
            // user: userExist
        }, { status: 200 })
    }
    catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Error getting message acceptance status',
            error: error
        }, { status: 500 })
    }
}