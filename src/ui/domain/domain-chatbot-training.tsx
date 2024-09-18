import AppSectionTitle from '@/components/app-section-title'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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
      <Separator className="mb-8"/>
      <div className="mt-4">
        <h3 className="font-semibold">
          Bot Questions
        </h3>
        <p>
          Add Questions to your bot to extend its functionality
        </p>
        <Link href={`/domains/${domainId}/questions/new`} className="bg-background hover:bg-muted-foreground">
          Create Question
        </Link>
        /**
        * display the list of questions here
         */
      </div>
    </div>
  )
}

export default DomainChatBotTraining