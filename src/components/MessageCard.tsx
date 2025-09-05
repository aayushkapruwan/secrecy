import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import ApiResponseType from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { messageType } from "@/models/User";
import axios from "axios";
type MessageCardProps = {
  message: messageType;
  onMessageDelete: (messageid: any) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  async function handleMessageDelete() {
    try {
      const response = await axios.delete(
        `/api/delete-message?messageid=${message._id}`
      );
      toast(response.data.message);
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseType>;
      toast("error", {
        description:
          axiosError.response?.data.message ?? "Failed to delete message",
      });
    }
  }
  return (
    <div className="bg-white rounded-xl p-6 border border-purple-200/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-purple-900 mb-3 leading-relaxed">{message.content}</p>
          <div className="flex items-center gap-2 text-sm text-purple-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-purple-400 hover:text-red-500 hover:bg-red-50 ml-4 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white border-purple-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-purple-900">Delete Message</AlertDialogTitle>
              <AlertDialogDescription className="text-purple-600">
                Are you sure you want to delete this message? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-purple-200 text-purple-700 hover:bg-purple-50">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleMessageDelete();
                }}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default MessageCard;
