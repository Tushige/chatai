import { getDomain } from '@/actions/domain.action';
import AppPageTitle from '@/components/app-page-title';
import AppSectionContainer from '@/components/app-section-container';
import AppSectionHeroContainer from '@/components/app-section-hero-container';
import ChatWindow from '@/ui/chat-window';
import DomainChatBotTraining from '@/ui/domain/domain-chatbot-training';
import DomainCodeIntegration from '@/ui/domain/domain-code-integration';
import DomainSettings from '@/ui/domain/domain-settings';
import { redirect } from 'next/navigation';
import React from 'react';

const DomainSettingsPage = async ({ params }: {params: {id: string}}) => {
  const domainId = params.id;
  if (!domainId) {
    redirect('/');
  }
  const domain = await getDomain(params.id);
  return (
    <div>
      <AppSectionHeroContainer>
        <AppPageTitle
          title={domain.name}
          description='Manage your domain and chatbox settings'
        />
      </AppSectionHeroContainer>
      <AppSectionContainer>
        <DomainCodeIntegration domain={domain} />
        <DomainSettings domain={domain} />
        <DomainChatBotTraining domainId={domainId} />
        <div className="relative pb-4 pr-8">
          <ChatWindow domain={domain} className="bottom-10 right-10"/>
        </div>
      </AppSectionContainer>
    </div>
  );
};

export default DomainSettingsPage;
