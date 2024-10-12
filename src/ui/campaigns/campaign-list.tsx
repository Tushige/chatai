'use client'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import CampaignAddForm from './campaign-add-form'
import Loader from '@/components/loader'
import { AppRelativeDate } from '@/components/app-date'
import CampaignCreateForm from './campaign-create-form'

const CampaignsList = ({
  campaigns,
  domainId
}) => {
  return (
    <>
      {
        !campaigns || campaigns.length < 1 ? (
          <div className="text-text text-medium text-center text-secondary">
            Create a campaign to get started
            <CampaignCreateForm domainId={domainId}/>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-[42rem]">
            <div className="text-text text-medium text-center text-secondary flex justify-end">
              <CampaignCreateForm domainId={domainId}/>
            </div>
            <ul className="flex flex-col gap-4 max-w-[42rem]">
              {
                campaigns.map(d => (
                  <li key={d.id}>
                    <CampaignCard campaign={d} />
                  </li>
                ))
              }
            </ul>
          </div>
        )
      }
    </>
  )
}

type CampaignCardProps  = {
  campaign: {
    id: string,
    name: string,
    description: string,
    participants: string[],
    createdAt: string
  }
}
function CampaignCard({
  campaign
}: CampaignCardProps) {
  const timestamp = useMemo(() => new Date(campaign.createdAt).getTime(), [campaign.createdAt])
  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <Card className="flex flex-row justify-between items-center cursor-pointer hover:bg-surface">
        <CardHeader>
          <CardTitle>{campaign.name}</CardTitle>
          <CardDescription>{campaign.description}</CardDescription>
        </CardHeader>
        <div className="px-8 text-sm">
          <AppRelativeDate timestamp={timestamp} />
        </div>
      </Card>
    </Link>
  )
}
export default CampaignsList