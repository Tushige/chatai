'use client';
import React, { useEffect, useState } from 'react';
import DotPattern from '@/components/magicui/dot-pattern';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {motion} from 'framer-motion';
import {  getConversations} from '@/actions/conversations.action';
import { Conversation } from './types';
import Loader from '@/components/loader';
import { cn } from '@/lib/utils';
import ConversationLiveList from './conversation-live-list';
import ConversationLiveMessenger from './conversation-live-messenger';
import { Toggle } from '@/components/ui/toggle';
import { updateConversationLive } from '@/actions/conversations.action';
import Pusher from 'pusher-js';
import { pusher } from '../../lib/pusher-client';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConversationLiveUI = ({ domains }) => {
  const [domainsIdx, setDomainsIdx] = useState<string>('0');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>(null);
  const [loading, setLoading] = useState(false);

  function onDomainChange(value: string) {
    setSelectedConversation(null);
    setDomainsIdx(value);
  }

  useEffect(() => {
    fetchConversations();
  }, [domainsIdx])

  const fetchConversations = async () => {
    console.log('fetching conversations')
    setLoading(true);
    setSelectedConversation(null)
    try {
      let conversations = await getConversations(domains[domainsIdx].id);
      setConversations(conversations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!domains || domains.length < 1) {
    return (
      <div className='text-secondary text-medium flex h-[90vh] items-center justify-center'>
        Create a Domain first and then come back
      </div>
    );
  }
  return (
    <div className='grid min-h-[100vh] max-h-screen w-full grid-cols-12'>
      <div className='col-span-4 max-h-screen min-h-screen grid grid-rows-[50px_50px_1fr] pb-[50px] pt-10 gap-2'>
        <Select onValueChange={onDomainChange}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Pick a Domain' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Domain</SelectLabel>
              {domains.map((domain, domainsIdx: string) => (
                <SelectItem
                  key={domain.id}
                  value={domainsIdx}
                  className='bg-background text-text'
                >
                  {domain.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex justify-between items-center">
          <ListTitle domainName={domains[domainsIdx].name} />
          <motion.button
            className="p-2 rounded-md border border-border"
            whileTap={{ scale: 0.8 }}
            onClick={fetchConversations}
          >
            <RefreshCcw className="size-4"/>
          </motion.button>
        </div>
          {
            loading ? (
              <div className='h-[90vh] w-full items-center justify-center'>
                <Loader className="size-12" />
              </div>
            ) : (
              <ConversationLiveList
                conversations={conversations}
                selectedConversation={selectedConversation}
                setSelectedConversation={setSelectedConversation}
              />
            )
          }
        </div>
      <div className='col-span-1 flex justify-center'>
        <Separator orientation='vertical' />
      </div>
      <div className='col-span-7 flex flex-col'>
        <div className='relative h-full min-w-[400px] max-w-[960px] px-5'>
          <DotPattern
            className={cn(
              '[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]',
              'z-0'
            )}
          />
          {
            selectedConversation ? (
              <ConversationLiveMessenger
                conversation={selectedConversation}
              />
            ) : (
              <div className='w-full h-full flex justify-center items-center text-center text-md relative z-1'>  
                <div className="border border-border rounded-md p-4 bg-background">
                  Select a conversation to see messages
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

function ListTitle({ domainName }) {
  if (!domainName) {
    return (
      <h2 className='text-text-secondary'>
        Select a domain to see conversations
      </h2>
    );
  }
  return (
    <h2 className='text-text-secondary'>
      {domainName}
    </h2>
  );
}

export default ConversationLiveUI;
