import { ComplexMessage } from '@chatbotkit/react/hooks/useConversationManager'
import { SparklesIcon, UserIcon } from '@heroicons/react/24/outline'
import React from 'react'

type Props = {
  messages: ComplexMessage[],
  botName: string,
  thinking: boolean
}

const ChatMessages = ({
  messages,
  botName,
  thinking
}: Props) => {
  return (
    <div>
      {
        messages.map( ({id, type, text}) => {
          switch(type) {
            case 'user':
              return (
                <div 
                  key={id}
                  className="whitespace-pre-wrap border-b border-border py-5 hover:bg-surface px-6"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="relative flex h-[20px] w-[20px] overflow-hidden rounded-full text-sm transition duration-150 hover:opacity-70 focus:outline-none">
                      <UserIcon 
                        className="absolute w-7"
                        alt="profile picture"
                      />
                    </div>
                    <p className="text-sm font-medium">You</p>
                  </div>
                  <p className="text-sm font-light">
                    {text}
                  </p>
                </div>
              )
            case 'bot':
              return (
                <div
                  key={id}
                  className="whitespace-pre-wrap border-b border-border py-5 hover:bg-surface px-6"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="relative h-[20px] w-[20px] overflow-hidden rounded-full text-sm transition duration-150 hover:opacity-70 border border-border focus:outline-none flex items-center justify-center">
                      <SparklesIcon className="h-3 w-3 text-text-foreground" />
                    </div>
                    <p className="text-sm font-medium">{botName}</p>
                  </div>

                  <p className={`text-sm dark:opacity-80 font-light`}>
                    {text}
                  </p>
                </div>
              )
          }
        })
      }
      {thinking ? (
        <div
          key="thinking"
          className="whitespace-pre-wrap border-b border-zinc-200 py-5 hover:bg-zinc-50 px-6"
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className="relative h-[20px] w-[20px] overflow-hidden rounded-full text-sm transition duration-150 hover:opacity-70 border border-zinc-200 focus:outline-none flex items-center justify-center bg-black">
              <SparklesIcon className="h-3 w-3 text-white" />
            </div>
            <p className="text-sm font-medium">{botName}</p>
          </div>

          <p className={`text-sm dark:opacity-80 font-light`}>
            Thinking...
          </p>
        </div>
      ) : null}
      
    </div>
  )
}

export default ChatMessages