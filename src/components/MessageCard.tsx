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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger>
              <X className="bg-red" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your message and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    handleMessageDelete();
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
        </div>
      </CardHeader>
    </Card>
  );
}

export default MessageCard;
