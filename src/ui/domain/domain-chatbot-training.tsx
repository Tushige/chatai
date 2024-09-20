import AppSectionTitle from '@/components/app-section-title'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React from 'react'

const DomainChatBotTraining = ({
  domainId
}) => {
  return (
    <div className="mt-8">
      <AppSectionTitle
        title="Teach your Bot"
        description="Unlock the full potential of your chatbot by teaching it your unique data. By prodiving it with the information it needs, it will be able to understand and respond to your requests more effecively."
      />
      <Separator className="mt-4 mb-8"/>
      <div className="mt-4">
        <h3 className="font-semibold">
          Bot Questions
        </h3>
        <p>
          Add Questions to your bot to extend its functionality
        </p>
        <Link href={`/domains/${domainId}/questions/new`} className="flex flex-row items-center gap-2 border border-text rounded-lg w-fit px-4 py-2 bg-background hover:bg-muted-foreground my-4">
          <span>Create Question</span>
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </div>
  )
}

export default DomainChatBotTraining