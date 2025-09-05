import connectToDatabase from "@/lib/dbConnect"
import { User } from "@/models/User"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import { User as nextUser } from "next-auth"
export async function DELETE(req: NextRequest) {
    const url = new URL(req.url);
    const messageid = url.searchParams.get("messageid");
    await connectToDatabase()
    const session = await getServerSession(authOptions)
    const _user: nextUser = session?.user;
    if (!session || !_user) {
        return NextResponse.json({
            success: false,
            message: "unauthorized"
        }, { status: 400 })
    }
    try {
        const updateResult = await User.updateOne({ _id: _user._id }, { $pull: { messages: { _id: messageid } } })
        if (updateResult.modifiedCount === 0) {
            return Response.json(
                { message: 'Message not found or already deleted', success: false },
                { status: 404 }
            );
        }

        return Response.json(
            { message: 'Message deleted', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting message:', error);
        return Response.json(
            { message: 'Error deleting message', success: false },
            { status: 500 }
        );
    }
}