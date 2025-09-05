
import { messageType, User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConnect";
export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const { username, content }: { username: string, content: string } = await req.json();
        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ message: "User not found", success: false },
                { status: 404 }
            )
        }
        if (!user.isAcceptingMessage) {
            return NextResponse.json({ message: "User is not accepting messages", success: false },
                { status: 400 }
            )
        }
        const message = { content, createdAt: new Date() } as messageType;
        user.messages.push(message);
        await user.save();
        return NextResponse.json({ message: "Message sent successfully", success: true },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json({ message: "Error sending message", success: false },
            { status: 500 }
        )
    }
}