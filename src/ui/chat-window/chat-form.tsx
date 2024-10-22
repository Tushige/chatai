'use client';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import { useConversationManager } from '@chatbotkit/react';
import { BotOptions } from '@chatbotkit/sdk/bot/v1';
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import ChatMessages from './chat-messages';
import { cn, extractEmailsFromString } from '@/lib/utils';
import { createContact } from '@/actions/contact.action';
import pusherJs from 'pusher-js';
import { pusher } from '@/lib/pusher-client';
import { Message } from '../conversations/types';
import { sendLiveMessage } from '@/actions/chatbot.action';
import { Separator } from '@/components/ui/separator';
import { XIcon } from 'lucide-react';
import Image from 'next/image';

type Bot = {
  datasetId: string;
  backstory: string;
  botName: string;
  model: string;
};

function ChatForm({
  setOpen,
  bot,
  domainId,
  conversation,
  cbkConversationId,
  token,
}: {
  bot: BotOptions;
  domainId: string;
  cbkConversationId: string;
  token: string;
}) {
  const { name } = bot;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [assistantOnline, setAssistantOnline] = useState(false)
  const [asyncProgress, setAsyncProgress] = useState(false);
  const {
    text,
    setText,

    thinking,
    messages: botMessages,
    submit: sendMessageToBot,
  } = useConversationManager({ conversationId: cbkConversationId, token });

  const typing = thinking || asyncProgress;

  useEffect(() => {
    const saveBotMessage = async () => {
      try {
        setAsyncProgress(true);
        const lastMessage = botMessages[botMessages.length-1];
        // we extract bot messages and save them to our conversation record in the db
        if (lastMessage.type === 'bot') {
          // save the bot message in DB and forward it to the assistant
          await sendLiveMessage({text: lastMessage.text, conversationId: conversation.id, type: lastMessage.type});
        }
      } catch (err) {
        console.error(err)
      } finally {
        setAsyncProgress(false);
      }
    }
    if (messages && messages.length > 0) {
      saveBotMessage();
    }
  }, [botMessages.length])
  /**
   * Subscribing to the presence channel lets the assistant know that the customer is online/offline
   */
  useEffect(() => {
    const pusherClient = new pusherJs(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: 'us2',
      authEndpoint: '/api/pusher/auth',
      auth: {
        params: {
          conversation_id: conversation.id
        }
      },
    })

    const presenceChannel = pusherClient.subscribe(`presence-channel`)
    presenceChannel.bind("pusher:member_removed", async (member) => {
      if (member.role === 'assistant') {
        setAssistantOnline(false);
      }
    });

    return () => {
      presenceChannel.unbind();
      pusherClient.unsubscribe('presence-channel');
    }
  }, [conversation.id]);
  
  /**
   * sub to assistant messages
   */
  useEffect(() => {
    const channel = pusher.subscribe(`channel-${conversation.id}`);

    channel.bind('message', (data: {type: string, text: string}) => {
      // includes messages from others + you
      setMessages(prev => [...prev, {
        id: uuidv4(),
        type: data.type,
        text: data.text
      }]);
    })
    channel.bind('status', (data: {type: string, online: boolean}) => {
      if (data.type === 'assistant') {
        setAssistantOnline(data.online)
        setMessages(prev => [
          ...prev,
          {
            type: 'status',
            name: 'Customer Rep',
            text: data.online ? 'has joined the chat' : 'has left the chat'
          }
        ])
      }
    })
    return () => {
      channel.unbind();
      pusher.unsubscribe(`channel-${conversation.id}`);
    }
  }, [conversation.id])

  const sendMessage = async () => {
    if (!message) return;
    try {
      await sendLiveMessage({text: message, conversationId: conversation.id, type: 'user'})
      // we only send messages to the bot if real rep is offline
      if (!assistantOnline) {
        sendMessageToBot();
      }
    } catch (err) {
      console.error('failed to send message with error');
      console.error(err);
    } finally {
      setMessage('')
    }
  }
  return (
    <>
      <div className='relative mb-4 flex flex-row items-center gap-2'>
      <div className='flex h-[80px] w-[80px] items-center justify-center rounded-full bg-background'>
        <Image
          src='/images/plus.png'
          width={36}
          height={36}
          alt='chatbot avatar'
        />
      </div>
        <p>{bot.name}</p>
        <div className={cn("size-[12px] bg-border rounded-full", {"bg-green-400": assistantOnline})}/>
        <XIcon
          className='absolute right-[10px] top-[10px] size-6 cursor-pointer'
          onClick={() => setOpen(false)}
        />
      </div>
      <Separator />
      <ChatContent
        domainId={domainId}
        conversationId={conversation.id}
        cbkConversationId={cbkConversationId}
        messages={messages}
        botName={name}
        thinking={typing}
        text={text}
        setText={setText}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </>
  );
}

function ChatContent({
  domainId,
  conversationId,
  cbkConversationId,
  messages,
  botName,
  thinking,
  text,
  setText,
  message,
  setMessage,
  sendMessage,
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const onSubmit = async (e) => {
    e.preventDefault();
    // let's extract email address if available
    const emailArr = extractEmailsFromString(text);
    try {
      if (emailArr && emailArr.length > 0) {
        // found email
        // create contact record with the found email
        const contact = await createContact({
          email: emailArr[0],
          domainId,
          conversationId,
        });
      }
      sendMessage();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <form onSubmit={onSubmit} className='bg-background'>
      <div className='scrollbar-hi chat-window h-[25rem] overflow-y-scroll bg-background'>
        <ChatMessages 
          messages={messages}
          botName={botName}
          thinking={thinking}
        />
        <div ref={messagesEndRef} />
      </div>

      <div className='relative p-6'>
        <input
          value={message}
          className='flex h-12 w-full rounded-lg border border-border bg-background px-3 py-2 pr-12 text-sm text-text shadow ring-offset-white transition duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
          placeholder='Say something4...'
          onChange={(e) => {
            setMessage(e.target.value);
            setText(e.target.value);
          }}
        />
        <Button
          type='submit'
          disabled={!text}
          className='absolute right-8 top-1/2 h-8 w-8 -translate-y-1/2 transform hover:bg-surface'
        >
          <ArrowLeftEndOnRectangleIcon className='min-h-[0.75rem] min-w-[0.75rem]' />
        </Button>
      </div>
    </form>
  );
}

export default ChatForm;
