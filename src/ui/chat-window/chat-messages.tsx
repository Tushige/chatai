import { ComplexMessage } from '@chatbotkit/react/hooks/useConversationManager';
import { SparklesIcon, UserIcon } from '@heroicons/react/24/outline';
import { BotIcon, CircleUser } from 'lucide-react';
import React from 'react';

type Props = {
  messages: ComplexMessage[];
  botName: string;
  thinking: boolean;
};

const ChatMessages = ({ messages, botName, thinking }: Props) => {
  return (
    <div>
      {messages.map(({ id, type, text }) => {
        switch (type) {
          case 'user':
            return (
              <div
                key={id}
                className='whitespace-pre-wrap border-b border-border px-6 py-5 hover:bg-surface'
              >
                <div className='mb-2 flex items-center space-x-2'>
                  <div className='relative flex h-[20px] w-[20px] overflow-hidden rounded-full text-sm transition duration-150 hover:opacity-70 focus:outline-none'>
                    <UserIcon className='absolute w-7' alt='profile picture' />
                  </div>
                  <p className='text-sm font-medium'>You</p>
                </div>
                <p className='text-sm font-light'>{text}</p>
              </div>
            );
          case 'assistant':
            return (
              <div
                key={id}
                className='whitespace-pre-wrap border-b border-border px-6 py-5 hover:bg-surface'
              >
                <div className='mb-2 flex items-center space-x-2'>
                  <div className='relative flex h-[20px] w-[20px] items-center justify-center overflow-hidden rounded-full border border-border text-sm transition duration-150 hover:opacity-70 focus:outline-none'>
                    <CircleUser className='h-3 w-3 text-text-foreground' />
                  </div>
                  <p className='text-sm font-medium'>Real rep</p>
                </div>

                <p className={`text-sm font-light dark:opacity-80`}>{text}</p>
              </div>
            );
          case 'bot':
            return (
              <div
                key={id}
                className='whitespace-pre-wrap border-b border-border px-6 py-5 hover:bg-surface'
              >
                <div className='mb-2 flex items-center space-x-2'>
                  <div className='relative flex h-[20px] w-[20px] items-center justify-center overflow-hidden rounded-full border border-border text-sm transition duration-150 hover:opacity-70 focus:outline-none'>
                    <BotIcon className='h-3 w-3 text-text-foreground' />
                  </div>
                  <p className='text-sm font-medium'>{botName}</p>
                </div>

                <p className={`text-sm font-light dark:opacity-80`}>{text}</p>
              </div>
            );
          case 'status':
            return (
              <div 
                key={id}
                className="text-center py-2 text-sm"
              >
                <span className="text-text-foreground font-bold">Real representative</span>
                <span>{' ' + text}</span>
              </div>
            )
          default:
            return (
              <div key={id} />
            )
        }
      })}
      {thinking ? (
        <div
          className='whitespace-pre-wrap border-b border-border px-6 py-5 hover:bg-surface'
        >
          <div className='mb-2 flex items-center space-x-2'>
            <div className='relative flex h-[20px] w-[20px] items-center justify-center overflow-hidden rounded-full border border-border bg-background text-sm transition duration-150 hover:opacity-70 focus:outline-none'>
              <SparklesIcon className='h-3 w-3 text-text-foreground' />
            </div>
            <p className='text-sm font-medium'>{botName}</p>
          </div>
          <p className={`text-sm font-light dark:opacity-80`}>Thinking...</p>
        </div>
      ) : null}
    </div>
  );
};

export default ChatMessages;
