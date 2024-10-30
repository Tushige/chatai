import AppPageTitle from '@/components/app-page-title';
import Link from 'next/link';
import React from 'react';
import { getAllDomains } from '@/actions/domain.action';
import { ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import AppSectionContainer from '@/components/app-section-container';
import AppSectionHeroContainer from '@/components/app-section-hero-container';
import { Domain } from '@prisma/client';

const CampaignsPage = async () => {
  const domains = await getAllDomains();
  return (
    <div className='flex flex-col'>
      <AppSectionHeroContainer>
        <AppPageTitle
          title='Campaigns'
          description='Organize your email campaigns and track them effectively here'
        />
      </AppSectionHeroContainer>
      <AppSectionContainer>
        {!domains || domains.length < 1 ? (
          <div className='text-secondary text-medium text-secondary text-center lg:mt-[200px]'>
            Create a Domain first and then come back
          </div>
        ) : (
          <>
            <h3 className='text-secondary'>Select a domain too see campaigns</h3>
            <Separator className='mb-8 mt-4 border-border' />
            <ul className='flex flex-col gap-4'>
              {domains.map((domain: Domain) => {
                return (
                  <Link
                    key={domain.id}
                    href={`/campaigns/domains/${domain.id}`}
                    className='flex flex-row items-center gap-2'
                  >
                    <span className='underline'>{domain.name}</span>
                    <ArrowRight className='size-4' />
                  </Link>
                );
              })}
            </ul>
          </>
        )}
      </AppSectionContainer>
    </div>
  );
};
export default CampaignsPage;
