// import { openai } from '@ai-sdk/openai';
// import { streamText } from 'ai';
// import { NextResponse } from 'next/server';

// export const maxDuration = 30;

// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json();
// console.log(messages);

//     // Call OpenAI GPT-4o
//     const result = streamText({
//       model: openai('gpt-4o'),
//       messages: [
//         {
//           role: 'system',
//           content:
//             'You are an assistant that suggests short, fun, and engaging anonymous message ideas. ' +
//             'Always return exactly 5 suggestions, separated by "||". ' +
//             'Keep each suggestion under 8 words.',
//         },
//         {
//           role: 'user',
//           content:
//             'Give me 5 short, catchy anonymous messages separated by ||',
//         },
//         ...(messages || []), // Keep previous conversation if passed
//       ],
//     });

//     return result.toUIMessageStreamResponse();
//   } catch (error) {
//     console.error('Error in suggest-messages API:', error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: 'Failed to fetch suggested messages. Please try again later.',
//       },
//       { status: 500 }
//     );
//   }
// }
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';
export async function GET(req: Request) {
  try {
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: 'Give me 5 short, catchy anonymous messages or questions to a person  separated by ||',
    });
    return NextResponse.json({ text });
  } catch (error) {
    console.log(error);

  }
}
