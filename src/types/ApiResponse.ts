import { messageType } from "@/models/User";
interface ApiResponseType {
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Array<messageType>
}
 export default ApiResponseType