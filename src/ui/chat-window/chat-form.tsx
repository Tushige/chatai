'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useConversationManager } from '@chatbotkit/react'
import { BotOptions } from '@chatbotkit/sdk/bot/v1';
import { ArrowLeftEndOnRectangleIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef } from "react";
import ChatMessages from './chat-messages';

type Bot = {
  datasetId: string,
  backstory: string,
  botName: string,
  model: string
}

function ChatForm({
bot
}: {
  bot: BotOptions
}) {
  const {backstory, datasetId, model, botName} = bot
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const {thinking, text, setText, messages, submit} = useConversationManager({
    endpoint: '/api/complete',
    backstory,
    datasetId,
    model: {
      name: model,
      config: {
        temperature: 0.7
      }
    }
  })
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [messages])
  return (
    <div className="">
      <form
        onSubmit={(e) => {
          console.log('submitting message')
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
    </div>
  )
}

export default ChatForm