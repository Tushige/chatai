'use client';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import Link from 'next/link';
import React, { useMemo } from 'react';
import { AppRelativeDate } from '@/components/app-date';
import CampaignCreateForm from './campaign-create-form';

const CampaignsList = ({ campaigns, domainId }) => {
  return (
    <>
      {!campaigns || campaigns.length < 1 ? (
        <div className='text-medium text-secondary text-center text-text'>
          <span className="block mb-4">Create a campaign to get started</span>
          <CampaignCreateForm domainId={domainId} />
        </div>
      ) : (
        <div className='flex max-w-[42rem] flex-col gap-4'>
          <div className='text-medium text-secondary flex justify-end text-center text-text'>
            <CampaignCreateForm domainId={domainId} />
          </div>
          <ul className='flex max-w-[42rem] flex-col gap-4'>
            {campaigns.map((d) => (
              <li key={d.id}>
                <CampaignCard campaign={d} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

type CampaignCardProps = {
  campaign: {
    id: string;
    name: string;
    description: string;
    participants: string[];
    createdAt: string;
  };
};
function CampaignCard({ campaign }: CampaignCardProps) {
  const timestamp = useMemo(
    () => new Date(campaign.createdAt).getTime(),
    [campaign.createdAt]
  );
  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <Card className='flex cursor-pointer flex-row items-center justify-between hover:bg-surface'>
        <CardHeader>
          <CardTitle>{campaign.name}</CardTitle>
          <CardDescription>{campaign.description}</CardDescription>
        </CardHeader>
        <div className='px-8 text-sm'>
          <AppRelativeDate timestamp={timestamp} />
        </div>
      </Card>
    </Link>
  );
}
export default CampaignsList;
