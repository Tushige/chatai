
import React from 'react';
import UsageMetricsUI from '@/ui/dashboard/usage-metrics-ui';
import { getAuthId } from '@/actions/auth';
import { getAuthUser } from '@/actions/user.action';
import {
  totalEmailCountForUser,
} from '@/actions/campaign.action';
import AppSectionContainer from '@/components/app-section-container';
import AppSectionHeroContainer from '@/components/app-section-hero-container';
import { capitalizeWord } from '@/lib/utils';
import AppPageTitle from '@/components/app-page-title';

const page = async () => {
  const authId = await getAuthId();
  const user = await getAuthUser(authId!);
  const numEmails = await totalEmailCountForUser(user.id);
  const metrics = [
    {
      label: 'Domains',
      value: user.domains.length,
      max: user.billing.plan.domainLimit,
    },
    {
      label: 'Emails',
      value: numEmails,
      max: user.billing.plan.emailLimit,
    },
  ];
  return (
    <div className='w-full'>
      <AppSectionHeroContainer className="relative bg-background-secondary">
        <AppPageTitle
          title='Usage'
          description='This section provides insights into your usage'
        />
      </AppSectionHeroContainer>
      <AppSectionContainer>
        <div>
        <p className='text-text'>
          Current plan:{' '}
          <span className='font-bold text-text-foreground'>
            {capitalizeWord(user.billing.plan.name)}
          </span>
        </p>
        </div>
        <div className='mt-8'>
          <UsageMetricsUI metrics={metrics} />
        </div>
      </AppSectionContainer>
    </div>
  );
};

export default page;
