'use client';
import { AppRelativeDate } from '@/components/app-date';
import { AvatarIcon } from '@radix-ui/react-icons';
import { Conversation, Message } from './types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { pusher } from './pusher-client';

type Props = {
  conversations: Conversation[];
  selectedConversation: Conversation,
  setSelectedConversation: (value: Conversation) => void;
};

const ConversationLiveList = ({
  conversations,
  selectedConversation,
  setSelectedConversation,
}: Props) => {

  if (!conversations || conversations.length < 1) {
    return (
      <div className="flex justify-center text-text-secondary">
        No Conversations here
      </div>
    )
  }

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation)
  }

  return (
    <ul>
      {conversations.map((conversation) =>
          <Button
            key={conversation.id}
            onClick={() => selectConversation(conversation)}
            className={cn('m-0 h-auto w-full bg-background p-0 text-foreground hover:bg-muted', {'bg-surface': conversation.id === selectedConversation?.id})}
          >
            <MessageCard
              message={conversation.messages && conversation.messages[0]}
              createdAt={conversation.createdAt}
              email={conversation.email}
              live={conversation.customerLive}
            />
          </Button>
      )}
    </ul>
  );
};

type MessageCardProps = {
  message: Message;
  createdAt: number;
  email: string | null;
  live: boolean
};

function MessageCard({ message, createdAt, email, live }: MessageCardProps) {
  return (
    <div className={cn('grid w-full grid-cols-3 items-center justify-between gap-4 rounded-md border p-2 hover:bg-surface')}>
      <div className='col-span-2 grid grid-cols-8 items-center'>
        <div className='col-span-1'>
          <AvatarIcon className='size-8' />
        </div>
        <div className='col-span-7 flex max-w-[100%] flex-col text-left'>
          <div className='text-sm font-semibold flex gap-2 items-center'>
            <span>{email ? email : 'Anonymous'}</span>
            <div className={cn('size-2 rounded-full animate-pulse', {'bg-success': live})} />
          </div>
            <p className={cn('overflow-hidden text-ellipsis whitespace-nowrap text-sm', {'text-text-secondary': !message?.message})}>
            {message?.message || 'no messages'}
          </p>
        </div>
      </div>
      <div className='col-span-1 text-right text-sm'>
        <AppRelativeDate timestamp={createdAt} />
      </div>
    </div>
  );
}

export default ConversationLiveList;
