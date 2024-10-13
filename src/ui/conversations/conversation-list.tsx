'use client';
import { AppRelativeDate } from '@/components/app-date';
import { AvatarIcon } from '@radix-ui/react-icons';
import { Conversation, Message } from './types';
import { Button } from '@/components/ui/button';

type Props = {
  conversations: Conversation[];
  setSelectedConversation: (value: Conversation) => void;
};

const ConversationList = ({
  conversations,
  setSelectedConversation,
}: Props) => {
  if (!conversations || conversations.length < 1) {
    return (
      <div className="flex justify-center text-text-secondary">
        No Conversations here
      </div>
    )
  }
  return (
    <ul>
      {conversations.map((conversation) =>
        conversation.messages && conversation.messages.length < 1 ? null : (
          <Button
            key={conversation.id}
            onClick={() => setSelectedConversation(conversation)}
            className='m-0 h-auto w-full bg-background p-0 text-foreground hover:bg-muted'
          >
            <MessageCard
              message={conversation.messages[0]}
              createdAt={conversation.messages[0].createdAt}
              email={conversation.email}
            />
          </Button>
        )
      )}
    </ul>
  );
};

type MessageCardProps = {
  message: Message;
  createdAt: number;
  email: string | null;
};
function MessageCard({ message, createdAt, email }: MessageCardProps) {
  return (
    <div className='grid w-full grid-cols-3 items-center justify-between gap-4 rounded-md border p-2 hover:bg-surface'>
      <div className='col-span-2 grid grid-cols-8 items-center'>
        <div className='col-span-1'>
          <AvatarIcon className='size-8' />
        </div>
        <div className='col-span-7 flex max-w-[100%] flex-col text-left'>
          <span className='text-sm font-semibold'>
            {email ? email : 'Anonymous'}
          </span>
          <p className='overflow-hidden text-ellipsis whitespace-nowrap text-sm'>
            {message?.text || 'no messages found'}
          </p>
        </div>
      </div>
      <div className='col-span-1 text-right text-sm'>
        <AppRelativeDate timestamp={createdAt} />
      </div>
    </div>
  );
}

export default ConversationList;
