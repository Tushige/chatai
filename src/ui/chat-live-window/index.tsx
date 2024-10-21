'use client';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { createConversation, sendCustomerStatus } from '@/actions/chatbot.action';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { Loader, XIcon } from 'lucide-react';
import ChatLiveForm from './chat-live-form';
import { updateConversation, updateConversationLive } from '@/actions/conversations.action';

const ChatLiveWindow = ({ domain }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState(null);

  const openChatWindow = async () => {
    setLoading(true);
    setOpen(true);
    let newConversation = conversation;
    if (!newConversation) {
      newConversation = await createConversation(domain.id);
      setConversation(newConversation)
    } 
    setLoading(false)
  };

  const closeChatWindow = async () => {
    setOpen(false);
  }
  return (
    <>
      <div className='fixed z-50 right-0 bottom-0'>
        <motion.button
          onClick={() => openChatWindow()}
          className='flex size-[60px] items-center justify-center rounded-full bg-accent p-4 text-text'
          whileHover={{
            scale: 1.1,
            transition: { duration: 0.2 },
          }}
          initial={{ y: 200 }}
          whileTap={{ scale: 0.8 }}
          animate={open && !loading ? { y: 200 } : { y: 0 }}
        >
          {loading ? (
            <Loader className='size-6 animate-spin'/>
          ) : (
            <ChatBubbleBottomCenterTextIcon className='size-12 text-text-foreground' />
          )}
        </motion.button>
      </div>
      <div className='z-51 fixed bottom-0 right-0 text-text'>
        <motion.div
          initial={{y: 1000}}
          animate={open && !loading ? { y: 0 } : { y: 1000 }}
          className='relative h-[600px] w-[400px] rounded-xl border border-zinc-200 bg-background shadow-md'
        >
          {conversation ? (
            <ChatLiveForm
              domainId={domain.id}
              conversationId={conversation.id}
              close={closeChatWindow}
            />
          ) : (
            <div>loading</div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ChatLiveWindow;
