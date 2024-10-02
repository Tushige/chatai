'use client'
import React, { useEffect, useState } from 'react'
import DotPattern from "@/components/magicui/dot-pattern";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectItem
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import ConversationMessenger from './conversation-messenger'
import AppSectionTitle from '@/components/app-section-title'
import ConversationList from './conversation-list'
import { getConversation, getMessages } from '@/actions/chatbot.action'
import { Conversation } from './types'
import Loader from '@/components/loader'
import { cn } from '@/lib/utils'

/*
 * returns the contact record that contains conversationId
* undefined otherwise
 */
function getEmailByConversationId(contacts, conversationId) {
  if (!contacts) return null
  if (!conversationId) return null
  return contacts.find(contact => {
    return contact.conversationIds.includes(conversationId)
  })
}

const ConversationUI = ({
  domains
}) => {
  const [domainsIdx, setDomainsIdx] = useState<string>('0')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(null)
  const [loading, setLoading] = useState(false)

  function onDomainChange(value: string) {
    setSelectedConversation(null)
    setDomainsIdx(value)
  }

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true)
      try {
        const conversationIds = domains[domainsIdx].chatBot.conversationIds
        const conversations = await Promise.all(conversationIds.map(async (id: string) => {
          // TODO - fetch in parallel
          const conversation = await getConversation(id)
          const messages = await getMessages(id)
          const contact = getEmailByConversationId(domains[domainsIdx].contacts, id)
          return {
            id,
            messages: messages.items,
            email: contact ? contact.email : null
          }
        }))
        setConversations(conversations)
      } catch(err) {
        console.error(err)
        
      } finally {
        setLoading(false)
      }
    }
    fetchConversations()
  }, [domainsIdx])
  if (loading) {
    return <Loader />
  }
  if (!domains || domains.length < 1) {
    return (
      <div className="h-[90vh] flex justify-center items-center text-secondary text-medium">
        Create a Domain first and then come back
      </div>
    )
  }
  return (
    <div className="w-full h-full grid grid-cols-12 pt-10">
      <div className="col-span-4">
        <Select onValueChange={onDomainChange}>
          <SelectTrigger className="w-full mb-8">
            <SelectValue placeholder="Pick a Domain"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Domain</SelectLabel>
              {
                domains.map( (domain, domainsIdx: string) => (
                  <SelectItem key={domain.id} value={domainsIdx} className="text-text bg-background">{domain.name}</SelectItem>
                ))
              }
            </SelectGroup>
          </SelectContent>
        </Select>
        <ListTitle domainName={domains[domainsIdx].name} />
        <ConversationList conversations={conversations} setSelectedConversation={setSelectedConversation} />
      </div>
      <div className="col-span-1 flex justify-center">
        <Separator orientation="vertical" />
      </div>
      <div className="col-span-7 flex flex-col">
        <div className="px-5 min-w-[400px] max-w-[960px] h-full relative">
          <DotPattern
            className={cn(
              "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
            )}
          />
          <AppSectionTitle title="Conversation" className="mb-8"/>
          <ConversationMessenger messages={selectedConversation?.messages || []}/>
        </div>
      </div>
    </div>
  )
}

function ListTitle({domainName}) {
  if (!domainName) {
    return (
      <h2 className="text-text-secondary">Select a domain to see conversations</h2>
    )
  }
  return (
    <h2 className="text-text-secondary mb-8">
      Showing conversations for {domainName} 
    </h2>
  )
}

export default ConversationUI