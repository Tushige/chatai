'use client'
import { getMessages } from "@/actions/chatbot.action"
import AppDate from "@/components/app-date"
import Loader from "@/components/loader"
import { AvatarIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import { Conversation, Message } from "./types"
import { Button } from "@/components/ui/button"

type Props = {
  conversations: Conversation[],
  setSelectedConversation: (value: Conversation) => void
}

const ConversationList = ({
  conversations,
  setSelectedConversation
}: Props) => {
  return (
    <ul>
      {
        conversations.map(conversation => (
          conversation.messages && conversation.messages.length < 1 ? (
            null
          ) : (
            <Button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className="w-full h-auto p-0 m-0 bg-background text-foreground hover:bg-muted"
            >
              <MessageCard 
                message={conversation.messages[0]}
                createdAt={conversation.messages[0].createdAt}
                email={conversation.email}
              />
            </Button>
          )
        ))
      }
    </ul>
  )
}

type MessageCardProps = {
  message: Message,
  createdAt: number,
  email: string | null
}
function MessageCard({message, createdAt, email}: MessageCardProps) {
  return (
    <div className="w-full grid grid-cols-3 items-center justify-between gap-4 border rounded-md p-2 hover:bg-surface">
      <div className="col-span-2 grid grid-cols-8 items-center">
        <div className="col-span-1">
          <AvatarIcon className="size-8"/>
        </div>
        <div className="col-span-7 flex flex-col max-w-[100%] text-left">
          <span className="text-sm font-semibold">
            {
              email ? email : 'Anonymous'
            }
          </span>
          <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            {message?.text || "no messages found"}
          </p>
        </div>
      </div>
      <div className="col-span-1 text-sm text-right">
        <AppDate timestamp={createdAt} />
      </div>
    </div>
  )
}

export default ConversationList