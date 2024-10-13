import AppPageTitle from '@/components/app-page-title';
import AppSectionTitle from '@/components/app-section-title';
import EmailTable from '@/ui/campaigns/email-table';
import EmailTableColumns from '@/ui/campaigns/email-table/email-table-columns';
import { campaignData } from '@/ui/campaigns/email-table/data';
import React, { useState } from 'react';
import { randomUUID } from 'crypto';
import { getCampaign, totalEmailCountForUser } from '@/actions/campaign.action';
import { Separator } from '@/components/ui/separator';
import CampaignEmailTemplate from '@/ui/campaigns/campaign-email-template';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getDomain, getDomainWithContacts } from '@/actions/domain.action';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAuthId } from '@/actions/auth';
import { getAuthUser } from '@/actions/user.action';
import AppSectionHeroContainer from '@/components/app-section-hero-container';
import AppSectionContainer from '@/components/app-section-container';

const CampaignPage = async ({ params }) => {
  const authId = await getAuthId();
  const user = await getAuthUser(authId!);
  const numEmails = await totalEmailCountForUser(user.id);
  const campaignId = params.id;
  const campaign = await getCampaign(campaignId);
  if (!campaign) {
    console.error('Campaign not found');
  }
  const limitReached = numEmails >= user.billing.plan.emailLimit;
  const domain = await getDomainWithContacts(campaign.domainId);
  const recipients = campaign.contacts.map((c) => c.email);
  return (
    <div className='h-full w-full'>
      <AppSectionHeroContainer>
        <Breadcrumb className='mb-4'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/campaigns'>Domains</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/campaigns/domains/${campaign.domainId}`}>
                {domain.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='text-text-foreground'>
                {campaign.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <AppPageTitle
          title={campaign.name}
          description={campaign.description}
        />
      </AppSectionHeroContainer>
      <AppSectionContainer>
        <div className='flex h-full w-full flex-col gap-8 xl:flex-row'>
          <div className='w-full'>
            <AppSectionTitle
              title={''}
              description='Add Recipients to your campaign. Then send your campaign email in the campaign template View'
            />
            <Separator className='my-4 text-text' />
            <EmailTable
              columns={EmailTableColumns}
              contacts={domain.contacts}
              campaign={campaign}
            />
          </div>
          <Separator
            orientation='vertical'
            className='hidden h-full bg-border xl:inline-block'
          />
          <div className='w-full'>
            <AppSectionTitle
              title={''}
              description='Campaign Template View'
              className='mt-8 xl:mt-0'
            />
            <Separator className='my-4 text-text' />
            {limitReached ? (
              <div className='mb-8 flex w-fit flex-col gap-4 rounded-lg border border-error p-4'>
                <p className='text-text'>
                  You've reached your plan limits. Upgrade your plan to continue
                  your access to campaign tools.
                </p>
                <Link
                  href='/settings/membership'
                  className='flex items-center gap-2 underline'
                >
                  Upgrade
                  <ArrowRight className='size-4' />
                </Link>
              </div>
            ) : (
              <CampaignEmailTemplate
                recipients={recipients}
                campaignId={campaign.id}
              />
            )}
          </div>
        </div>
      </AppSectionContainer>
    </div>
  );
};

export default CampaignPage;
