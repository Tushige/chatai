'use client';
import { AppRelativeDate } from '@/components/app-date';
import { AvatarIcon } from '@radix-ui/react-icons';
import { Conversation, Message } from './types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { pusher } from '../../lib/pusher-client';

type Props = {
  conversations: Conversation[];
  selectedConversation: Conversation,
  setSelectedConversation: (value: Conversation) => void;
};

const ConversationLiveList = ({
  conversations: initialConversations,
  selectedConversation,
  setSelectedConversation,
}: Props) => {
  const [conversations, setConversations] = useState(initialConversations);
  useEffect(() => {
    /**
     * subs to a presence channel. This channel keeps track of online status of visitors.
     */
    // const channel = pusher.subscribe('customer-status');
    console.log('creating status notifications')
    const presenceChannel = pusher.subscribe(`presence-channel`)
    presenceChannel.bind('pusher:subscription_succeeded', (data) => {
      console.log('[Assistant] Current memebrs: ', data);
      // go through the current members and mark them as online
      Object.keys(data.members).forEach(id => {
        console.log(`checking ${id}`)
        if (id !== data.myID) {
          console.log('it is online')
          setConversations(prev => prev.map(c => {
            if (c.id === id) {
              return {
                ...c,
                customerLive: true
              }
            }
            return c;
          }))
        }
      })
    });
    presenceChannel.bind('pusher:subscription_error', (error) => {
      console.log('[Assistant] error during sub')
      console.error(error)
    });
    presenceChannel.bind("pusher:member_added", (member) => {
      // For example
      console.log('added')
      console.log(member);
      const memberConversationId = member.info.conversationId;
      console.log(`checking ${memberConversationId}`)
      if (memberConversationId) {
        console.log('it is online')
        setConversations(prev => prev.map(c => {
          if (c.id === memberConversationId) {
            return {
              ...c,
              customerLive: true
            }
          }
          return c;
        }))
      }
    });
    presenceChannel.bind("pusher:member_removed", (member) => {
      // For example
      console.log('member removed')
      console.log(member);
      const memberConversationId = member.info.conversationId;
      if (memberConversationId) {
        setConversations(prev => prev.map(c => {
          if (c.id === memberConversationId) {
            return {
              ...c,
              customerLive: false
            }
          }
          return c;
        }))
      }
    });
    return () => {
      presenceChannel.unbind();
      pusher.unsubscribe(`presence-channel`);
    }
  },[])

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
    <ul className="max-h-screen hide-scroll overflow-y-scroll">
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
