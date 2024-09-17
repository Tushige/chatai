'use client'
import { getMessages } from "@/actions/chatbot.action"
import AppDate from "@/components/app-date"
import Loader from "@/components/loader"
import { AvatarIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import { Conversation } from "./types"
import { Button } from "@/components/ui/button"

type Props = {
  conversations: Conversation[],
  selSelectedConversation: () => void
}

const ConversationList = ({
  conversations,
  setSelectedConversation
}: Props) => {
  return (
    <ul>
      {
        conversations.map(conversation => (
          <Button
            key={conversation.id}
            onClick={() => setSelectedConversation(conversation)}
            className="w-full h-auto p-0 m-0 bg-background text-foreground hover:bg-muted"
          >
            <MessageCard  message={conversation.messages[0]} />
          </Button>
        ))
      }
    </ul>
  )
}

type MessageCardProps = {
  message: Message
}
function MessageCard({message}: MessageCardProps) {
  const d = new Date(message.createdAt)
  return (
    <div className="w-full grid grid-cols-3 items-center justify-between gap-4 border rounded-md p-2 ">
      <div className="col-span-2 grid grid-cols-8 items-center">
        <div className="col-span-1">
          <AvatarIcon className="size-8"/>
        </div>
        <div className="col-span-7 flex flex-col max-w-[100%] text-left">
          <span className="text-sm font-semibold">Anyonymous</span>
          <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">{message.text}</p>
        </div>
      </div>
      <div className="col-span-1 text-sm text-right">
        <AppDate timestamp={message.createdAt} />
      </div>
    </div>
  )
}

export default ConversationList