import { getDomain } from '@/actions/domain.action';
import ChatWindow from '@/ui/chat-window';
import React from 'react'

export default async function ChatBotWindow({params}) {
  const domainId = params.id;
  const domain = await getDomain(domainId);
  return (
    <ChatWindow domain={domain}/>
  )
}
