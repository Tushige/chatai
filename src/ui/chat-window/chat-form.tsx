'use client';
import { Button } from '@/components/ui/button';
import { useConversationManager } from '@chatbotkit/react';
import { BotOptions } from '@chatbotkit/sdk/bot/v1';
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import ChatMessages from './chat-messages';
import { extractEmailsFromString } from '@/lib/utils';
import { createContact } from '@/actions/contact.action';

type Bot = {
  datasetId: string;
  backstory: string;
  botName: string;
  model: string;
};

function ChatForm({
  bot,
  domainId,
  conversationId,
  token,
}: {
  bot: BotOptions;
  domainId: string;
  conversationId: string;
  token: string;
}) {
  const { name } = bot;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    text,
    setText,

    thinking,
    messages,
    submit,
  } = useConversationManager({ conversationId, token });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ChatContent
      domainId={domainId}
      conversationId={conversationId}
      messages={messages}
      botName={name}
      thinking={thinking}
      messagesEndRef={messagesEndRef}
      text={text}
      setText={setText}
      submit={submit}
    />
  );
}

function ChatContent({
  domainId,
  conversationId,
  messages,
  botName,
  thinking,
  messagesEndRef,
  text,
  setText,
  submit,
}) {
  const onSubmit = async (e) => {
    e.preventDefault();
    // let's extract email address if available
    const emailArr = extractEmailsFromString(text);
    try {
      if (emailArr && emailArr.length > 0) {
        // found email
        // create contact record with the found email
        const contact = await createContact({
          email: emailArr[0],
          domainId,
          conversationId,
        });
      }
      submit();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <form onSubmit={onSubmit} className='bg-background'>
      <div className='scrollbar-hi chat-window h-[25rem] overflow-y-scroll bg-background'>
        <ChatMessages
          messages={messages}
          botName={botName}
          thinking={thinking}
        />
        <div ref={messagesEndRef} />
      </div>

      <div className='relative p-6'>
        <input
          value={text}
          className='flex h-12 w-full rounded-lg border border-border bg-background px-3 py-2 pr-12 text-sm text-text shadow ring-offset-white transition duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
          placeholder='Say something4...'
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <Button
          type='submit'
          disabled={!text}
          className='absolute right-8 top-1/2 h-8 w-8 -translate-y-1/2 transform hover:bg-surface'
        >
          <ArrowLeftEndOnRectangleIcon className='min-h-[0.75rem] min-w-[0.75rem]' />
        </Button>
      </div>
    </form>
  );
}

export default ChatForm;
