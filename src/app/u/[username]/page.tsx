// "use client"
// import { messageSchema } from '@/schemas/messageSchema'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useParams } from 'next/navigation'
// import React from 'react'
// import { useForm } from 'react-hook-form'
// import z from 'zod'
// import { useCompletion } from '@ai-sdk/react';
// import { Card, CardContent, CardHeader } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import axios, { AxiosError } from 'axios'
// import { toast } from 'sonner'
// import ApiResponseType from '@/types/ApiResponse'
// import { Textarea } from '@/components/ui/textarea'
// import { Separator } from '@radix-ui/react-separator'
// import Link from 'next/link'
// import { Loader2 } from 'lucide-react'
// function page() {
//   const [isLoading, setIsLoading] = React.useState(false)
//   const form = useForm<z.infer<typeof messageSchema>>({
//     resolver: zodResolver(messageSchema)
//   })
//   const messageContent = form.watch('content');
//   const params = useParams<{ username: string }>();
//   const username = params.username;
//   const onSubmit = async (data: z.infer<typeof messageSchema>) => {
//     // console.log(data); data is object
//     setIsLoading(true)
//     try {
//       const res = await axios.post<ApiResponseType>('/api/send-messages', {
//         username,
//         content: data.content
//       })
//       toast(res.data.message)
//       form.reset({ ...form.getValues(), content: '' });
//     } catch (error) {
//       const axioserror = error as AxiosError<ApiResponseType>
//       toast(axioserror.response?.data.message || "unable to send message")
//     }
//     finally {
//       setIsLoading(false)
//     }

//   }
//   const initialMessageString = "What's your favorite movie?||Do you have any pets?||What's your dream job?";
//   const specialChar = '||';
//   const parseStringMessages = (messageString: string): string[] => {
//     return messageString ? messageString.split(specialChar) : [];
//   };
//   const {
//     complete,//function to  fetch completion string response from api
//     completion, // the completion string response from api
//     isLoading: isSuggestLoading, // boolean to track loading state
//     error,
//   } = useCompletion({
//     api: '/api/chat',
//     initialCompletion: initialMessageString, // Set initial completion to avoid undefined
//   });
//   const handleMessageClick = (message: string) => {
//     form.setValue('content', message);
//   };
//   const fetchSuggestedMessages = async () => {
//     try {
//       complete('Give me 5 short, catchy anonymous messages separated by ||');
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       toast('Failed to fetch suggested messages');
//     }
//   };

//   return (
//     <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
//       <h1 className="text-4xl font-bold mb-6 text-center">
//         Public Profile Link
//       </h1>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           <FormField
//             control={form.control}
//             name="content"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Send Anonymous Message to @{username}</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     placeholder="Write your anonymous message here"
//                     className="resize-none"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormDescription>
//                   This is your public display name.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="flex justify-center">
//             {isLoading ? (
//               <Button disabled>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Please wait
//               </Button>
//             ) : (
//               <Button type="submit" disabled={isLoading || !messageContent}>
//                 Send It
//               </Button>
//             )}
//           </div>
//         </form>
//       </Form>
//       {/* Suggested Messages */}
//       <div className="space-y-4 my-8">
//         <div className="space-y-2">
//           <Button
//             onClick={fetchSuggestedMessages}
//             className="my-4"
//             disabled={isSuggestLoading}
//           >
//             {isSuggestLoading ? 'Fetching Suggestions...' : 'Suggest Messages'}
//           </Button>
//           <p>Click on any message below to select it.</p>
//         </div>

//         <Card>
//           <CardHeader>
//             <h3 className="text-xl font-semibold">Suggestions</h3>
//           </CardHeader>
//           <CardContent className="flex flex-col space-y-4">
//             {error ? (
//               <p className="text-red-500">{error.message}</p>
//             ) : completion ? (
//               parseStringMessages(completion).map((message, index) => (
//                 <Button
//                   key={index}
//                   variant="outline"
//                   className="mb-2"
//                   onClick={() => handleMessageClick(message)}
//                 >
//                   {message}
//                 </Button>
//               ))
//             ) : (
//               <p className="text-gray-500">No suggestions available</p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//       <Separator className="my-6" />
//       <div className="text-center">
//         <div className="mb-4">Get Your Message Board</div>
//         <Link href={'/sign-up'}>
//           <Button>Create Your Account</Button>
//         </Link>
//       </div>
//     </div>
//   )
// }

// export default page

"use client"
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import ApiResponseType from '@/types/ApiResponse'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@radix-ui/react-separator'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
function page() {
  const [isSuggestLoading, setIsSuggestLoading] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  })
  const contentWatch = form.watch("content")
  //function to fill input of send message by clicking suggested messages button
  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };
  //getting username from url
  const params = useParams<{ username: string }>();
  const username = params.username;
  // function to send message
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    // console.log(data); data is object
    setIsSubmitting(true)
    try {
      const res = await axios.post<ApiResponseType>('/api/send-messages', {
        username,
        content: data.content
      })
      toast(res.data.message)
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axioserror = error as AxiosError<ApiResponseType>
      toast(axioserror.response?.data.message || "unable to send message")
    }
    finally {
      setIsSubmitting(false)
    }

  }
  //states and function to fetch suggested messages
  const initialMessageString = "What's your favorite movie?||Do you have any pets?||What's your dream job?";
  const [completion, setCompletion] = React.useState<string>(initialMessageString);
  const [error, setError] = React.useState<string | null>(null);
  const specialChar = '||';
  const parseStringMessages = (messageString: string): string[] => {
    return messageString ? messageString.split(specialChar) : [];
  };

  //function to fetch suggestedmessages
  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.get('/api/chat');
      if (response.data && response.data.text) {
        setCompletion(response.data.text);
        setError(null);
      } else {
        setError('No suggestions available');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast('Failed to fetch suggested messages');
      setError('Failed to fetch suggested messages');
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isSubmitting ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                sending
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting || !contentWatch}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>
      {/* Suggested Messages */}
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? 'Fetching Suggestions...' : 'Suggest Messages'}
          </Button>
          <p>Click on any message below to select it.</p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Suggestions</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : completion ? (
              parseStringMessages(completion).map((suggestedmessage, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(suggestedmessage)}
                >
                  {suggestedmessage}
                </Button>
              ))
            ) : (
              <p className="text-gray-500">No suggestions available</p>
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  )
}

export default page