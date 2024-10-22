'use client'
import { AppDate, AppRelativeDate } from '@/components/app-date';
import { cn } from '@/lib/utils';
import { AvatarIcon } from '@radix-ui/react-icons';
import { Bot, SmileIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Conversation, Message } from './types';
import Pusher, { Channel } from 'pusher-js';
import { sendLiveMessage, sendStatus } from '@/actions/chatbot.action';
import Loader from '@/components/loader';
import { getChatMessages, updateConversationLive } from '@/actions/conversations.action';
import AppSectionTitle from '@/components/app-section-title';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence  } from 'framer-motion';
import { pusher } from '../../lib/pusher-client';

type Props = {
  conversation: Conversation
};

const ConversationMessenger = ( {conversation }: Props) => {
  const channelRef = useRef<Channel>()
  const [messages, setMessages] = useState(null)
  const [message, setMessage] = useState('');
  const [live, setLive] = useState(false)
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        setLoading(true);
        const messages = await getChatMessages(conversation.id);
        setMessages(messages)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false);
      }
    }
    /******************************************
     * fetch messages if conversation changes
     ******************************************/
    if (conversation.id) {
      fetchMessages();
    } else {
      // clear messages if there is no selected conversation
      setMessages([])
    }
  }, [conversation.id]);

  useEffect(() => {
    /******************************************
     * handle realtime message sub/unsub
     ******************************************/
    if (!conversation) {
      return;
    }
    pusher.connection.bind('error', (err) => {
      console.log(`connection error`, err)
    })
    // if live mode is turned off and we're subscribed then unsub
    // subscribe to channel if live mode is on and we're not currently subscribed
    if (!channelRef.current) {
      channelRef.current = pusher.subscribe(`channel-${conversation.id}`);
      channelRef.current.bind('message', (data: {role: string, message: string}) => {
        setMessages(prev => [...prev, data]);
      })
    }
    return () => {
      cleanupPusher(pusher, channelRef)
    }
  }, [conversation.id, live])

  async function cleanupPusher(pusher, channelRef) {
    if (channelRef.current) {
      channelRef.current.unbind();
      channelRef.current = null;
    }
    pusher.unsubscribe(`channel-${conversation.id}`);
    // we turn off live mode automatically if user navigates away
    await updateConversationLive(conversation.id, false)
  } 

  if (!messages || loading) {
    return (
      <div className='size-full py-12'>
        <Loader className='h-[30px] w-[30px]' />
      </div>
    );
  }
  if (!messages || messages.length < 1) {
    return (
      <div className='w-full h-full flex justify-center items-center text-center text-md relative z-1'>  
        <div className="border border-border rounded-md p-4 bg-background text-sm">
          This Conversation has no messages.
        </div>
      </div>
    );
  }

  async function toggleLive() {
    try {
      await sendStatus({
        online: !live, 
        conversationId: conversation.id,
        type: 'assistant'
      });
      
      setLive(prev => !prev)
    } catch (err) {
      console.error(err)
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    await sendLiveMessage({
      text: message,
      conversationId: conversation.id,
      type: 'assistant' // this should be real rep
    })
    setMessage('')
  }

  return (
    <div className="max-h-screen min-h-screen grid grid-rows-[100px_1fr_100px] pb-[50px] pt-10">
      <div className="row-start-1 flex justify-between">
        <AppSectionTitle title='Conversation' className='mb-8' />
        {
          conversation && (
            <Toggle
              variant="outline"
              aria-label="Toggle bold"
              className={cn("flex gap-2 data-[state=on]:bg-transparent hover:bg-transparent border-text-secondary", {'border-success': conversation?.live})}
              onClick={toggleLive}
            >
              <div className={cn('size-2 rounded-full bg-border animate-pulse', {'bg-success': live})} />
              <span className={cn('border-border text-text-secondary', {'border-text-foreground text-text': live})}>
                Live
              </span>
            </Toggle>
          )
        }
      </div>
      <div className='row-start-2 flex flex-col gap-4 max-h-[100%] overflow-y-scroll chat-window pt-4'>
        {messages.map((d) => (
          <ChatMessage
            key={d.id}
            role={d.type}
            message={d.text}
            createdAt={d.createdAt}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <AnimatePresence initial={false}>
        {
          live && (
            <form onSubmit={sendMessage} className="row-start-3">
              <motion.div
                className='relative p-6'
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100, opacity: 0 }} // Animate out of view
              >
                <input
                  type="text"
                  value={message}
                  className='flex h-12 w-full rounded-lg border border-border bg-background px-3 py-2 pr-12 text-sm text-text shadow ring-offset-white transition duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                  placeholder='Say something...'
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                  type='submit'
                  disabled={!message}
                  className='absolute right-8 top-1/2 h-8 w-8 -translate-y-1/2 transform hover:bg-surface'
                >
                  <ArrowLeftEndOnRectangleIcon className='min-h-[0.75rem] min-w-[0.75rem]' />
                </Button>
              </motion.div>
            </form>
          )
        }
      </AnimatePresence>
    </div>
  );
};

type ChatMessageProps = {
  role: string;
  message: string;
  createdAt: number;
};

function ChatMessage({ role, message, createdAt }: ChatMessageProps) {
  return (
    <div
      className={cn('flex w-full flex-row items-start justify-end gap-2', {
        'flex-row-reverse': role === 'bot' || role === 'assistant',
      })}
    >
      <div className='flex flex-col justify-start gap-2 p-4 border border-accent rounded-md bg-surface z-[1]'>
        <AppDate timestamp={createdAt} className="text-sm text-text-secondary"/>
        <p>{message}</p>
      </div>
      {
        role === 'bot' && (
          <Bot className='size-6 shrink-0' />
        ) || role === 'assistant' && (
          <SmileIcon className="size-6 shrink-0" /> 
        ) || (
          <AvatarIcon className='size-6 shrink-0' />
        )
      }
    </div>
  );
}
export default ConversationMessenger;
