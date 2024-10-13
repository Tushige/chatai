import AppSectionTitle from '@/components/app-section-title';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React from 'react';

const DomainChatBotTraining = ({ domainId }) => {
  return (
    <div className='mt-16'>
      <AppSectionTitle
        title='Teach your Bot'
        description='Unlock the full potential of your chatbot by teaching it your unique data. By prodiving it with the information it needs, it will be able to understand and respond to your requests more effecively.'
      />
      <Separator className='mb-8 mt-4' />
      <div className='mt-4'>
        <h3 className='font-semibold'>Bot Questions</h3>
        <p className="text-sm text-text-secondary">Add Questions to your bot to extend its functionality</p>
        <Link
          href={`/domains/${domainId}/questions/new`}
          className='my-4 flex w-fit flex-row items-center gap-2 rounded-lg border border-text bg-background px-4 py-2 hover:bg-muted-foreground'
        >
          <span>Create Questions</span>
          <ArrowRightIcon className='size-4' />
        </Link>
      </div>
    </div>
  );
};

export default DomainChatBotTraining;
