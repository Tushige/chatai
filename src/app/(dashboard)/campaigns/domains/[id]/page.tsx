import { getCampaignsByDomainId } from '@/actions/campaign.action'
import AppPageTitle from '@/components/app-page-title'
import CampaignsList from '@/ui/campaigns/campaign-list'
import { redirect } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getDomain } from '@/actions/domain.action'
import { Separator } from '@/components/ui/separator'

const DomainCampaignsPage = async ({
  params
}) => {
  const domainId = params.id
  if (!domainId) redirect('/campaigns')
  const domain = await getDomain(domainId);
  const campaigns = await getCampaignsByDomainId(domainId)
  return (
    <div className="container px-4 lg:px-8 pt-10">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/campaigns">Domains</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-text-foreground">{domain.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <AppPageTitle title="Campaigns" description="Organize your email campaigns and track them effectively here"/>
      <h3 className="text-secondary">
        These are all of the campaigns belonging to {domain.name}
      </h3>
      <Separator className="border-border mb-8 mt-4" />
      <CampaignsList campaigns={campaigns} domainId={domainId} />
    </div>
  )
}

export default DomainCampaignsPage