'use client'
import DomainAddForm from '@/components/forms/domain/domain-add-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import CampaignAddForm from './campaign-add-form'
import Loader from '@/components/loader'
import AppDate from '@/components/app-date'

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
          <ul className="flex flex-col gap-4 max-w-[42rem]">
            {
              campaigns.map(d => (
                <li key={d.id}>
                  <CampaignCard campaign={d} />
                </li>
              ))
            }
          </ul>
        )
      }
    </>
  )
}

function CampaignCreateForm({
  domainId
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  if (loading) {
    return (
      <div className="py-12">
        <Loader className="w-[30px] h-[30px]"/>
      </div>
    )
  }
  return (
    <Drawer open={open}>
      <div className="flex justify-center items-center p-4">
        <Button className="bg-background rounded-full text-text hover:bg-surface hover:text-text-foreground p-2" onClick={() => setOpen(true)}>
          <PlusIcon className="w-6" />
        </Button>
      </div>
      <DrawerContent className="pb-12">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-text-foreground">
              Create a Campaign
            </DrawerTitle>
            <CampaignAddForm
              closeDrawer={() => setOpen(false)}
              onSuccess={() => setOpen(false)}
              loading={loading}
              setLoading={setLoading}
              domainId={domainId}
            />
          </DrawerHeader>
        </div>
      </DrawerContent>
    </Drawer>
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
        <div className="px-8">
          <AppDate timestamp={timestamp} />
        </div>
      </Card>
    </Link>
  )
}
export default CampaignsList