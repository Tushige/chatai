import { Separator } from '@/components/ui/separator'
import ChatForm from './chat-form'
import Image from 'next/image'
import React, { useState } from 'react'
import { getChatbot, getChatBotKitUserClient } from '@/actions/chatbot.action'

const ChatWindow = async ({domain}) => {
  const bot = await getChatbot(domain.chatBot.chatBotKitId)
  return (
    <div className="h-[600px] w-[400px] border bg-white border-zinc-200 rounded-xl shadow-md ">
      <div className="flex flex-row gap-2 items-center mb-4">
        <div className="w-[80px] h-[80px] rounded-full flex justify-center items-center bg-white">
          <Image
            src="/images/plus.png"
            width={36}
            height={36}
            alt="chatbot avatar"
          />
        </div>
        <p>
          {bot.name}
        </p>
      </div>
      <Separator />
      <ChatForm bot={bot} />
    </div>
  )
}


export default ChatWindow