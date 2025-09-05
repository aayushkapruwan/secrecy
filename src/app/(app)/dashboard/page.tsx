"use client"
import { messageType } from '@/models/User'
import React, { useCallback, useEffect, useState } from 'react'
import MessageCard from '@/components/MessageCard'
import { Switch } from '@/components/ui/switch'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptingMessageInSchema } from '@/schemas/acceptMessageSchema'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCcw, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'
import ApiResponseType from '@/types/ApiResponse'
function page() {
  //getting session and username
  const { data: session } = useSession()
  const username = session?.user.username;
  //generating profile url
  const [baseUrl, setBaseurl] = useState<string>("");//  const baseurl = `${window.location.protocol}//${window.location.host}`
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseurl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);
  const profileUrl: string = `${baseUrl}/u/${username}`
  //function to copy profile url to clipboard
  function copyToClipboard() {
    navigator.clipboard.writeText(profileUrl)
    toast('URL Copied!', {
      description: 'Profile URL has been copied to clipboard.',
    });
  }

  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [messages, setMessages] = useState<messageType[]>([])
  //form for accepting messages switch
  const form = useForm({
    resolver: zodResolver(acceptingMessageInSchema),
    defaultValues: {
      isAcceptingMessage: false
    }
  })
  const { register, watch, setValue } = form
  const acceptMessages = watch('isAcceptingMessage')
  //function to handle switch change
  const handleSwitchChange = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.post<ApiResponseType>('/api/acceptmessages', {
        acceptMessages: !acceptMessages
      })
      setValue('isAcceptingMessage', !acceptMessages)
      toast(response.data.message)
    } catch (error) {
      const axioserror = error as AxiosError<ApiResponseType>
      toast('error', {
        description: axioserror.response?.data.message || 'failed to update acceptance status',
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [toast, setValue, acceptMessages])
  //function to handle message delete by passing message id
  const handleDeleteMessage = (messageid: string) => {
    setMessages(messages.filter((message) => message._id !== messageid))
  }
  //function to fetch messages from api
  const fetchMessages = useCallback(async (refresh: Boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponseType>('/api/get-messages')
      setMessages(response.data.messages || [])
      if (refresh) {
        toast('Refreshed Messages', {
          description: 'Showing latest messages',
        });
      }
    } catch (error) {
      const axioserror = error as AxiosError<ApiResponseType>
      toast('error', {
        description: axioserror.response?.data.message || 'failed to fetch messages',
      })
    }
    finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [toast])
  //function to fetch accept messages status from api used in useEffect
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponseType>('/api/acceptmessages')
      console.log(response);

      setValue('isAcceptingMessage', response.data.isAcceptingMessage!)
    } catch (error) {
      const axioserror = error as AxiosError<ApiResponseType>
      toast('error', {
        description: axioserror.response?.data.message || 'failed to update acceptance status',
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [toast, setValue])

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [fetchMessages, fetchAcceptMessages, session, setValue, toast])

  return (
    <div className="min-h-screen bg-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Dashboard</h1>
          <p className="text-purple-600">Manage your anonymous messaging profile</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile URL Card */}
            <div className="bg-white rounded-xl p-6 border border-purple-200/50 shadow-sm">
              <h2 className="text-lg font-semibold text-purple-900 mb-4">Your Profile Link</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <input
                    type="text"
                    value={profileUrl}
                    disabled
                    className="flex-1 bg-transparent text-sm text-purple-700 outline-none"
                  />
                  <Button
                    size="sm"
                    onClick={copyToClipboard}
                    className="bg-purple-900 hover:bg-purple-800"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>

            {/* Message Settings Card */}
            <div className="bg-white rounded-xl p-6 border border-purple-200/50 shadow-sm">
              <h2 className="text-lg font-semibold text-purple-900 mb-4">Message Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-purple-900">Accept Messages</p>
                    <p className="text-sm text-purple-600">Allow others to send you messages</p>
                  </div>
                  <Switch
                    {...register('isAcceptingMessage')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                    className="data-[state=checked]:bg-purple-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Messages Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-purple-200/50 shadow-sm">
              <div className="p-6 border-b border-purple-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-purple-900">Messages</h2>
                    <p className="text-sm text-purple-600">Anonymous messages you've received</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      fetchMessages(true);
                    }}
                    className="border-purple-200 hover:bg-purple-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCcw className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-6">
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <MessageCard
                        key={message._id as string}
                        message={message}
                        onMessageDelete={handleDeleteMessage}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-medium text-purple-900 mb-2">No messages yet</h3>
                    <p className="text-purple-600">Share your profile link to start receiving anonymous messages</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default page