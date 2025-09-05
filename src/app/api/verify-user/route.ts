import connectToDatabase from "@/lib/dbConnect";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest): Promise<any> {
    await connectToDatabase();
    try {
        const { username, code } = await req.json();
        const decodedUsername = await decodeURIComponent(username)
        const userExist =await User.findOne({
            username:decodedUsername
        })
        if (!userExist) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }
        if (userExist.isVerified) {
            return NextResponse.json({
                success: false,
                message: "user already verified"
            }, {
                status: 200
            })
        }
        const codeVerifyOrNot = code == userExist.verifyCode;
        const codeExpiredOrNot = new Date(userExist.verifyCodeExpiry) > new Date()

        if (codeVerifyOrNot && codeExpiredOrNot) {
            userExist.isVerified = true;
            userExist.save()
            return NextResponse.json(
                { success: true, message: 'Account verified successfully' },
                { status: 200 }
            );
        }
        else if (!codeExpiredOrNot) {
            // Code has expired
            return NextResponse.json(
                {
                    success: false,
                    message:
                        'Verification code has expired. Please sign up again to get a new code.',
                },
                { status: 400 }
            );
        } else {
            // Code is incorrect
            return NextResponse.json(
                { success: false, message: 'Incorrect verification code' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error verifying user:', error);
        return NextResponse.json(
            { success: false, message: 'Error verifying user' },
            { status: 500 }
        );
    }
}
