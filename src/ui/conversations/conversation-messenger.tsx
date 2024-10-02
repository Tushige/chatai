import { AppRelativeDate } from '@/components/app-date'
import { cn } from '@/lib/utils'
import { AvatarIcon } from '@radix-ui/react-icons'
import { Bot } from 'lucide-react';
import React from 'react'
import { Message } from './types'

type Props = {
  messages: Message[]
}
const ConversationMessenger = ({
  messages
}: Props) => {
  if (!messages || messages.length < 1) {
    return (
      <div className="w-full text-center">
        Select a conversation to see messages
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-4">
      {
        messages.map(d => (
          <ChatMessage 
            key={d.id}
            type={d.type}
            message={d.text}
            createdAt={d.createdAt}
          />
        ))
      }
    </div>
  )
}

type ChatMessageProps = {
  type: string,
  message: string,
  createdAt: number
}

function ChatMessage({
  type,
  message,
  createdAt
}: ChatMessageProps) {
  return (
    <div className={cn(
      "w-full flex flex-row items-start justify-end",
      {'flex-row-reverse': type === 'bot'}
    )}>
      <div className="flex flex-col gap-2 p-4 justify-start bg-background">
        <AppRelativeDate timestamp={createdAt} />
        <p>
          {message}
        </p>
      </div>
      {
        type === 'bot' ? (
          <Bot className="size-6 shrink-0" />
        ) : (
          <AvatarIcon className="size-6 shrink-0"/>
        )
      }
    </div>
  )
}
export default ConversationMessenger