
import { createCustomer } from '@/actions/stripe'
import React from 'react'
import { Progress } from "@/components/ui/progress"
import UsageMetricsUI from '@/ui/dashboard/usage-metrics-ui'
import { getDomain } from '@/actions/domain.action'
import { getAuthId } from '@/actions/auth'
import { getAuthUser } from '@/actions/user.action'
import { totalEmailCountForCampaign, totalEmailCountForUser } from '@/actions/campaign.action'

const page = async () => {
  const authId = await getAuthId()
  const user = await getAuthUser(authId!)
  const numEmails = await totalEmailCountForUser(user.id)
  const metrics = [
    {
      label: 'Domains',
      value: user.domains.length,
      max: user.billing.plan.domainLimit
    },
    {
      label: 'Emails',
      value: numEmails,
      max: user.billing.plan.emailLimit
    }
  ]
  return (
    <div className="w-full">
      <h1 className="text-4xl text-text">
        Usage
      </h1>
      <p className="text-secondary text-sm mt-8">
        This section provides insights into your usage.
      </p>
      <div className="mt-8">
        <UsageMetricsUI metrics={metrics}/>
      </div>
    </div>
  ) 
}

export default page