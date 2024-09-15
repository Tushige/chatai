import { getDomain } from '@/actions/domain'
import ChatWindow from '@/ui/chat-window'
import React from 'react'

const BotPage = async ({params}) => {
  const domainId = params.id
  if (!domainId) return (
    <div>no data</div>
  )
  const domain = await getDomain(params.id) 
  return (
    <div className="container">
      <ChatWindow domain={domain}/>
    </div>
  )
}

export default BotPage