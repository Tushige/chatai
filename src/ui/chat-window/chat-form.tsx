'use client'
import { Button } from '@/components/ui/button';
import { useConversationManager } from '@chatbotkit/react'
import { BotOptions } from '@chatbotkit/sdk/bot/v1';
import { ArrowLeftEndOnRectangleIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from "react";
import ChatMessages from './chat-messages';
import { useToast } from '@/hooks/use-toast';
import { addConversation } from '@/actions/chatbot.action';

type Bot = {
  datasetId: string,
  backstory: string,
  botName: string,
  model: string
}

function ChatForm({
  botId,
  bot
}: {
  bot: BotOptions,
  botId: string
}) {
  const {toast} = useToast()
  const {backstory, datasetId, model, botName} = bot
  const [conversationId, setConversationId] = useState(undefined)
  const [token, setToken] = useState(undefined)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const {
    text,
    setText,
    
    thinking,
    messages,
    submit
  } = useConversationManager({conversationId, token})

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [messages])

  async function createSession() {
    const res = await fetch('/api/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!res) {
      throw new Error('Failed to create a conversation session')
    }
    const {conversationId, token} = await res.json()
    setConversationId(conversationId)
    setToken(token)
    const chatUpdates = await fetch('/api/chatbot/update-conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: botId, conversationId})
    })
    if (chatUpdates.status !== 200) {
      toast({
        title: 'ERROR',
        description: 'Chat Feature is Unavailable'
      })
    }
  }
  if (!conversationId || !token) {
    return (
      <Button onClick={() => createSession()}>Start Chat</Button>
    )
  }
  return (
    <ChatContent 
      messages={messages}
      botName={botName}
      thinking={thinking}
      messagesEndRef={messagesEndRef}
      text={text}
      setText={setText}
      submit={submit}
    />
  )
}

function ChatContent({
  messages,
  botName,
  thinking,
  messagesEndRef,
  text,
  setText,
  submit,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className=""
    >
      <div className="h-[25rem] overflow-y-scroll">
        <ChatMessages messages={messages} botName={botName} thinking={thinking}/>
        <div ref={messagesEndRef} />
      </div>

      <div className="relative p-6">
        <input
          value={text}
          className="flex h-12 w-full rounded-lg border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 border-zinc-200 shadow transition duration-150"
          placeholder="Say something4..."
          onChange={(e) => {
            setText(e.target.value)
          }}
        />
        <Button 
          type="submit"
          disabled={!text}
          className="h-8 w-8 absolute right-8 top-1/2 transform -translate-y-1/2"
          >
          <ArrowLeftEndOnRectangleIcon className="min-h-[0.75rem] min-w-[0.75rem]" /> 
          </Button>
      </div>
    </form>
  )
}

export default ChatForm