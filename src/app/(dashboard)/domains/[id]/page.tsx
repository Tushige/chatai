import {getDomain} from '@/actions/domain.action'
import { Separator } from '@/components/ui/separator'
import ChatWindow from '@/ui/chat-window'
import DomainChatBotTraining from '@/ui/domain/domain-chatbot-training'
import DomainCodeIntegration from '@/ui/domain/domain-code-integration'
import DomainSettings from '@/ui/domain/domain-settings'
import { redirect, useParams } from 'next/navigation'
import React from 'react'

const DomainSettingsPage = async ({params}) => {
  const domainId = params.id
  if (!domainId) {
    redirect('/')
  }
  const domain = await getDomain(params.id)  
  return (
    <div className="container px-4 lg:px-8 pt-8">
      <div className="mb-8">
        <h2 className="text-4xl">
         {domain.name}
        </h2>
        <p className="text-sm text-muted">
          Modify domain and chatbox settings
        </p>
      </div>
      <DomainCodeIntegration domain={domain}/>
      <DomainSettings domain={domain} />
      <DomainChatBotTraining domainId={domainId}/>
      <ChatWindow domain={domain}/>
    </div>
  )
}

export default DomainSettingsPage