import { ComplexMessage } from '@chatbotkit/react/hooks/useConversationManager';
import { SparklesIcon, UserIcon } from '@heroicons/react/24/outline';
import React from 'react';

type Props = {
  messages: ComplexMessage[];
  name: string;
  thinking: boolean;
};

const ChatLiveMessages = ({ messages, name, thinking }: Props) => {
  return (
    <div>
      {messages.map(({ id, role, message }) => {
        switch (role) {
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
                <p className='text-sm font-light'>{message}</p>
              </div>
            );
          case 'bot':
          case 'assistant':
            return (
              <div
                key={id}
                className='whitespace-pre-wrap border-b border-border px-6 py-5 hover:bg-surface'
              >
                <div className='mb-2 flex items-center space-x-2'>
                  <div className='relative flex h-[20px] w-[20px] items-center justify-center overflow-hidden rounded-full border border-border text-sm transition duration-150 hover:opacity-70 focus:outline-none'>
                    <SparklesIcon className='h-3 w-3 text-text-foreground' />
                  </div>
                  <p className='text-sm font-medium'>{name}</p>
                </div>

                <p className={`text-sm font-light dark:opacity-80`}>{message}</p>
              </div>
            );
          case 'status':
            return (
              <div 
                key={id}
                className="text-center py-2 text-sm"
              >
                <span className="text-text-foreground font-bold">{name}</span>
                <span>{' ' + message}</span>
              </div>
            )
        }
      })}
      {thinking ? (
        <div
          key='thinking'
          className='whitespace-pre-wrap border-b border-zinc-200 px-6 py-5 hover:bg-zinc-50'
        >
          <div className='mb-2 flex items-center space-x-2'>
            <div className='relative flex h-[20px] w-[20px] items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-black text-sm transition duration-150 hover:opacity-70 focus:outline-none'>
              <SparklesIcon className='h-3 w-3 text-white' />
            </div>
            <p className='text-sm font-medium'>{botName}</p>
          </div>

          <p className={`text-sm font-light dark:opacity-80`}>Thinking...</p>
        </div>
      ) : null}
    </div>
  );
};

export default ChatLiveMessages;
