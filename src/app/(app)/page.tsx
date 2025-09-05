'use client';


import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Logo from '@/components/Logo';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-purple-100'>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <section className="mb-16 animate-fade-in">
            <div className="mb-12">
              <Logo size="lg" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-purple-900 mb-6 leading-tight animate-slide-up">
              Anonymous
              <span className="block text-purple-600">Messaging</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-600 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Send and receive messages anonymously. Share your unique link and discover what others have to say.
            </p>
          </section>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-purple-200/50 shadow-sm">
              <div className="w-12 h-12 bg-purple-900 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-purple-900 mb-2">Anonymous</h3>
              <p className="text-purple-600 text-sm">Send messages without revealing your identity</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-purple-200/50 shadow-sm">
              <div className="w-12 h-12 bg-purple-900 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-purple-900 mb-2">Secure</h3>
              <p className="text-purple-600 text-sm">Your privacy is our top priority</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-purple-200/50 shadow-sm">
              <div className="w-12 h-12 bg-purple-900 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-purple-900 mb-2">Simple</h3>
              <p className="text-purple-600 text-sm">Easy to use, powerful features</p>
            </div>
          </div>

          {/* Carousel for Messages */}
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-purple-900 mb-8">Recent Messages</h2>
            <Carousel
              plugins={[Autoplay({ delay: 3000 })]}
              className="w-full"
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/1">
                    <div className="p-6">
                      <Card className="border-slate-200/50 shadow-sm bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-slate-900">{message.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Mail className="w-4 h-4 text-slate-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-slate-700 mb-2">{message.content}</p>
                              <p className="text-xs text-slate-500">
                                {message.received}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center text-purple-600">
            <p className="text-sm">© 2025 Secrecy. Built with privacy in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}