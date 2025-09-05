import { resend } from "@/lib/resend";
import VerificationEmailTEmplate from "../../emailTemplates/verificalEmialTemplate";
import ApiResponseType from "@/types/ApiResponse";
import { render } from "@react-email/render";
interface SendVerificationEmailParams {
    username: string;
    otp: string;
    email: string
}
export default async ({ username, otp, email }: SendVerificationEmailParams): Promise<ApiResponseType> => {
    try {
        const html = await render(VerificationEmailTEmplate({ username, otp }));
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'secrecy Verification Code',
             html,
        });
        return { success: true, message: 'Verification email sent successfully.' };
    } catch (error) {
        console.log(error);
        
        return { success: false, message: 'Failed to send verification email.' };
    }
};