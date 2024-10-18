import { getAllDomains } from '@/actions/domain.action';
import ConversationLiveUI from '@/ui/conversations/conversation-live-ui';
import ConversationUI from '@/ui/conversations/conversation-ui';
import React from 'react';

const ConversationsPage = async () => {
  const domains = await getAllDomains();
  return (
    <div className='container h-full pl-4 md:pl-8'>
      <ConversationLiveUI domains={domains} />
    </div>
  );
};

export default ConversationsPage;
