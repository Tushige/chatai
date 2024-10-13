import { getCampaignsByDomainId } from '@/actions/campaign.action';
import AppPageTitle from '@/components/app-page-title';
import CampaignsList from '@/ui/campaigns/campaign-list';
import { redirect } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getDomain } from '@/actions/domain.action';
import { Separator } from '@/components/ui/separator';
import AppSectionHeroContainer from '@/components/app-section-hero-container';
import AppSectionContainer from '@/components/app-section-container';

const DomainCampaignsPage = async ({ params }) => {
  const domainId = params.id;
  if (!domainId) redirect('/campaigns');
  const domain = await getDomain(domainId);
  const campaigns = await getCampaignsByDomainId(domainId);
  return (
    <div>
      <AppSectionHeroContainer className="mb-8">
        <Breadcrumb className='mb-4'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/campaigns'>Domains</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='text-text-foreground'>
                {domain.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <AppPageTitle
          title='Campaigns'
          description='Organize your email campaigns and track them effectively here'
        />
      </AppSectionHeroContainer>
      <AppSectionContainer>
        <CampaignsList campaigns={campaigns} domainId={domainId} /> 
      </AppSectionContainer>
    </div>
  );
};

export default DomainCampaignsPage;
