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
import { Loader2 } from 'lucide-react'
import { RefreshCcw } from 'lucide-react'
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
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      {/* copy profile url section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
      {/*  switch section */}
      <div className="mb-4">
        <Switch
          {...register('isAcceptingMessage')}
          checked={acceptMessages} //wiring the state to switch
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />
      {/* message refresh */}
      <Button
        className="mt-4"
        variant="outline"
        disabled={isLoading}
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      {/* messages section */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );

}

export default page