import { getCampaignsByDomainId } from '@/actions/campaign.action'
import AppPageTitle from '@/components/app-page-title'
import CampaignsList from '@/ui/campaigns/campaign-list'
import { redirect } from 'next/navigation'

const DomainCampaignsPage = async ({
  params
}) => {
  const domainId = params.id
  if (!domainId) redirect('/campaigns')
  const campaigns = await getCampaignsByDomainId(domainId)
  return (
    <div className="container px-4 lg:px-8 pt-8">
      <AppPageTitle title="Campaigns" description="Organize your email campaigns and track them effectively here"/>
      <CampaignsList campaigns={campaigns} domainId={domainId} />
    </div>
  )
}

export default DomainCampaignsPage