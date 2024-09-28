import { Separator } from '@/components/ui/separator'
import ChatForm from './chat-form'
import Image from 'next/image'
import React, { useState } from 'react'
import { getChatbot, getChatBotKitUserClient } from '@/actions/chatbot.action'
import ChatUI from './chat-ui'
import { CHATBOT_TOKEN_DURATION } from '@/app/constants'
import { redirect } from 'next/navigation'

const ChatWindow = async ({domain}) => {
  const bot = await getChatbot(domain.chatBot.chatBotKitId)
  if (!bot) {
    console.error('bot not found')
    redirect('/')
  }
  // const {conversationId, token} = await fetch(`/api/session?botId=${bot.id}`, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   next: {
  //     revalidate: CHATBOT_TOKEN_DURATION,
  //   }
  // })
  return (
    <ChatUI bot={bot} domain={domain}/>
  )
}


export default ChatWindow