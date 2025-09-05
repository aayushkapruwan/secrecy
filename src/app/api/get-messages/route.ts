import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/dbConnect";
export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 })
        }
        const userid = new mongoose.Types.ObjectId(user._id);
        const userExist = await User.findById(userid);
        if (!userExist) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 })
        }
        const userAggregate = await User.aggregate([
            {
                $match: {
                    _id: userid
                }
            },
            {
                $unwind: '$messages'
            },
            {
                $sort: {
                    'messages.createdAt': -1
                }
            },
            {
                $group: {
                    _id: '$_id',
                    messages: { $push: '$messages' }
                }
            }
        ])
        if (!userAggregate || userAggregate.length === 0) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 })
        }
        return NextResponse.json({ messages: userAggregate[0].messages, success: true,message:'messages fetched succefully' }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Error connecting to database", success: false },
            { status: 500 }
        )
    }
}