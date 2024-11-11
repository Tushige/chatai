'use client';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import { useConversationManager } from '@chatbotkit/react';
import { BotOptions } from '@chatbotkit/sdk/bot/v1';
import { useEffect, useRef, useState } from 'react';
import ChatMessages from './chat-messages';
import { BOT_DELIMETER, BOT_HELP, cn, containsLink, extractEmailsFromString } from '@/lib/utils';
import { createContact } from '@/actions/contact.action';
import pusherJs from 'pusher-js';
import { pusher } from '@/lib/pusher-client';
import { Message } from '../conversations/types';
import { sendLiveMessage, sendNotificationEmail } from '@/actions/chatbot.action';
import { Separator } from '@/components/ui/separator';
import { SendIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { Conversation } from '@prisma/client';

const urlPattern = /(https?:\/\/[^\s]+)/g;

type ChatFormProps = {
  setOpen: () => void,
  bot: BotOptions,
  domainId: string,
  botIcon: string,
  conversation: Conversation,
  token: string,
  welcomeMessage: string
};

function ChatForm({
  setOpen,
  cbkBot,
  domainId,
  botIcon,
  conversation,
  cbkConversationId,
  token,
  welcomeMessage
}: ChatFormProps) {
  const { name } = cbkBot;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      type: 'bot',
      text: welcomeMessage,
      createdAt: (new Date()).getTime()
    }
  ]);
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
        if (lastMessage && lastMessage.type === 'bot') {
          const found = lastMessage.text.indexOf(BOT_HELP);
          if (found > -1) {
            // if customer requested real rep send an email notification
            sendNotificationEmail(domainId);
          }
          let modifiedText = lastMessage.text;
          const _containsLink = containsLink(modifiedText);
          if (_containsLink) {
            modifiedText = lastMessage.text.replace(urlPattern, '<a href="$&" class="text-text text-blue-600 underline underline-offset-1">book your appointment</a>');
          }
          modifiedText = modifiedText.replace(BOT_DELIMETER, '').replace(BOT_HELP, '');
          // save the bot message in DB and forward it to the assistant
          await sendLiveMessage({
            text: modifiedText,
            conversationId: conversation.id,
            type: lastMessage.type,
            link: _containsLink
          });
        }
      } catch (err) {
        console.error(err)
      } finally {
        setAsyncProgress(false);
      }
    }
    if (botMessages && botMessages.length > 0) {
      saveBotMessage();
    }
  }, [botMessages.length]);
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

    channel.bind('message', (data: {type: string, text: string, link: boolean}) => {
      // includes messages from others + you
      setMessages(prev => [...prev, {
        id: uuidv4(),
        type: data.type,
        text: data.text,
        link: data.link
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
            text: data.online ? 'has joined the chat' : 'has left the chat',
            link: false
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
      <div className='relative flex flex-row items-center gap-2'>
        <div className="flex gap-2 items-center">
          <div className='flex gap-2 w-full p-4 items-center rounded-full bg-background'>
            <Image
              src={`https://ucarecdn.com/${botIcon}/-/preview/64x64`}
              width={36}
              height={36}
              alt='chatbot avatar'
            />
            <p>{cbkBot.name}</p>
          </div>
          <div className={cn("size-[12px] bg-border rounded-full", {"bg-green-400": assistantOnline})}/>
        </div>
        <XIcon
          className='absolute right-[25px] top-[15px] size-6 cursor-pointer'
          onClick={() => setOpen(false)}
        />
      </div>
      <Separator />
      <ChatContent
        domainId={domainId}
        conversationId={conversation.id}
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
        await createContact({
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
    <form onSubmit={onSubmit} className='h-full grid grid-rows-12 bg-transparent overflow-hidden'>
      <div className='row-span-10 chat-window overflow-y-auto bg-background'>
        <ChatMessages 
          messages={messages}
          botName={botName}
          thinking={thinking}
        />
        <div ref={messagesEndRef} />
      </div>

      <div className='row-span-2 relative px-4 flex items-center rounded-lg'>
        <input
          value={message}
          className='flex h-12 w-full rounded-lg border border-border bg-background px-3 py-2 pr-12 text-sm text-text shadow ring-offset-white transition duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
          placeholder='Ask us anything...'
          onChange={(e) => {
            setMessage(e.target.value);
            setText(e.target.value);
          }}
        />
        <Button
          type='submit'
          disabled={!text}
          className='bg-surface p-2 absolute right-8 top-1/2 h-8 w-8 -translate-y-1/2 transform hover:bg-surface cursor-pointer'
        >
          <SendIcon className='size-[24px] min-w-[24px]' />
        </Button>
      </div>
    </form>
  );
}

export default ChatForm;
