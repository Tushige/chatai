import AppPageTitle from '@/components/app-page-title'
import AppSectionTitle from '@/components/app-section-title'
import EmailTable from '@/ui/campaigns/email-table'
import EmailTableColumns from '@/ui/campaigns/email-table/email-table-columns'
import { campaignData } from '@/ui/campaigns/email-table/data'
import React, { useState } from 'react'
import { randomUUID } from 'crypto'
import { getCampaign } from '@/actions/campaign.action'
import { Separator } from '@/components/ui/separator'
import CampaignEmailTemplate from '@/ui/campaigns/campaign-email-template'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getDomain } from '@/actions/domain.action'

const CampaignPage = async ({
  params,
}) => {
  const campaignId = params.id
  const campaign = await getCampaign(campaignId)
  if (!campaign) {
    console.error('Campaign not found')
  }
  const domain = await getDomain(campaign.domainId)
  let recipients = campaign.contacts.map(c => c.email)
  return (
    <div className="w-full h-full">
      <div className="container h-full pt-10 px-4 xl:px-8">
        <Breadcrumb className="mb-4">
        <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/campaigns">Domains</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/campaigns/domains/${campaign.domainId}`}>{domain.name}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-text-foreground">{campaign.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <AppPageTitle title={campaign.name} description={campaign.description}/>
        <div className="w-full h-full flex flex-col gap-8 xl:flex-row ">
          <div className="w-full">
            <AppSectionTitle
              title={""}
              description="Manage your campaign recipients here"
            />
            <Separator className="text-text my-4"/>
            <EmailTable
              columns={EmailTableColumns}
              contacts={campaign.contacts}
              campaign={campaign}
            />
          </div>
          <Separator orientation='vertical' className="bg-border h-full hidden xl:inline-block"/>
          <div className="w-full">
            <AppSectionTitle
              title={""}
              description="Write your campaign email"
              className="mt-8 xl:mt-0"
            />
            <Separator className="text-text my-4"/>
            <CampaignEmailTemplate recipients={recipients}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignPage