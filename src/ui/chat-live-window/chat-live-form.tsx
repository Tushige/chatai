'use client';
import { Button } from '@/components/ui/button';
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { cn, extractEmailsFromString } from '@/lib/utils';
import { createContact } from '@/actions/contact.action';
import { useToast } from '@/hooks/use-toast';
import Pusher from 'pusher-js';
import { sendLiveMessage, sendStatus } from '@/actions/chatbot.action';
import ChatLiveMessages from './chat-live-messages';
import Image from 'next/image';
import { XIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { updateConversation } from '@/actions/conversations.action';
import { v4 as uuidv4 } from 'uuid';

type Bot = {
  datasetId: string;
  backstory: string;
  botName: string;
  model: string;
};

function ChatLiveForm({
  domainId,
  conversationId,
  close
}: {
  domainId: string;
  conversationId: string;
  close: any
}) {  
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [assistantOnline, setAssistantOnline] = useState(false)

  useEffect(() => {
    /**
     * sub to assistant messages and status
     */
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: 'us2'
    })

    const channel = pusher.subscribe(`channel-${conversationId}`);
    channel.bind('message', (data: {role: string, message: string}) => {
      setMessages(prev => [...prev, {
        id: uuidv4(),
        role: data.role,
        message: data.message
      }]);
    })
    channel.bind('status', (data: {role: string, online: boolean}) => {
      // customer received status update from assistant
      setAssistantOnline(data.online)
      // add the status message to the list of messages so we see them. role: 'status' will differentiate the message from regular messages
      setMessages(prev => [...prev, {
        id: uuidv4(),
        role: 'status',
        message: data.online ? 'has joined the chat' : 'has left the chat'
      }])
    })
    return () => {
      channel.unbind();
      pusher.unsubscribe(`channel-${conversationId}`);
      customerOff(); 
    }
  }, [conversationId])

  async function customerOff() {
    await updateConversation(conversationId, {customerLive: false});
  }
  const sendMessage = async () => {
    if (!message) return;
    try {
      await sendLiveMessage({message, conversationId, role: 'user'})
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
      <p>Customer Rep</p>
      <div className={cn("size-[12px] bg-red-900 rounded-full", {"bg-green-400": assistantOnline})}/>
      <XIcon
        className='absolute right-[10px] top-[10px] size-6 cursor-pointer'
        onClick={close}
      />
    </div>
    <Separator />
    <ChatContent
      domainId={domainId}
      conversationId={conversationId}
      messages={messages}
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
  message, 
  setMessage,
  sendMessage
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = async (e) => {
    e.preventDefault();
    // let's extract email address if available
    const emailArr = extractEmailsFromString(message);
    try {
      if (emailArr && emailArr.length > 0) {
        // found email
        // create contact record with the found email
        const contact = await createContact({
          email: emailArr[0],
          domainId,
          conversationId // this is the CBK conversation id
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
        <ChatLiveMessages
          name="real rep"
          thinking={false}
          messages={messages}
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
          }}
        />
        <Button
          type='submit'
          disabled={!message}
          className='absolute right-8 top-1/2 h-8 w-8 -translate-y-1/2 transform hover:bg-surface'
        >
          <ArrowLeftEndOnRectangleIcon className='min-h-[0.75rem] min-w-[0.75rem]' />
        </Button>
      </div>
    </form>
  );
}

export default ChatLiveForm;
