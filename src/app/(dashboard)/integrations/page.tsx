import AppPageTitle from '@/components/app-page-title';
import AppSectionContainer from '@/components/app-section-container';
import AppSectionHeroContainer from '@/components/app-section-hero-container';
import { Pickaxe } from 'lucide-react';
import React from 'react';

const IntegrationsPage = async () => {
  return (
    <div>
      <AppSectionHeroContainer>
        <AppPageTitle
          title="Integrations"
          description='Manage your app integrations'
        />
      </AppSectionHeroContainer>
      <AppSectionContainer>
        <div className="flex gap-2 items-center">
          <Pickaxe className="size-4"/>
          <span className="text-text">Coming Soon</span>
        </div>
      </AppSectionContainer>
    </div>
  );
};

export default IntegrationsPage;
