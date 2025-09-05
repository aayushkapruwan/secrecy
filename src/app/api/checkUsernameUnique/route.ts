import { User } from "@/models/User";
import connectToDatabase from "@/lib/dbConnect";
import { userNameValidation } from "@/schemas/signUpSchema";
import { z } from "zod"
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
const usernameCheckSchema = z.object({
    username: userNameValidation
})

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.nextUrl);
        const queryParams = {
            username: searchParams.get("username")
        }
        const result = usernameCheckSchema.safeParse(queryParams)
        if (!result.success) {
            const usernameErrors = result.error.format().username?.errors || [];
            return NextResponse.json({
                success: false,
                message:
                    usernameErrors?.length > 0
                        ? usernameErrors.join(', ')
                        : 'Invalid query parameters',
            },
                { status: 400 })
        }
        const { username } = result.data;
        const existingVerifiedUser = await User.findOne({
            username,
            isVerified: true,
        });
        if (existingVerifiedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Username is unique',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error checking username:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error checking username',
            },
            { status: 500 }
        );
    }
}