import DomainUpdateForm from '@/components/forms/domain/domain-update-form';
import DomainUpdateFormProvider from '@/components/forms/domain/domain-update-form-provider';
import DomainDeleteBox from './domain-delete-box';
import { Separator } from '@/components/ui/separator';
import AppSectionTitle from '@/components/app-section-title';
import { ChatBot, Domain } from '@prisma/client';

type Props = {
  domain: Domain & {
    chatBot: ChatBot
  };
};
const DomainSettings = ({ domain }: Props) => {
  const initialData = {
    icon: domain.icon,
    name: domain.name,
    welcomeMessage: domain.chatBot?.welcomeMessage || null,
  };
  return (
    <>
      <AppSectionTitle
        title='Domain Settings'
        description='update your domain info'
      />
      <Separator className='mb-8 mt-4' />
      <DomainUpdateFormProvider initialData={initialData} domainId={domain.id}>
        <DomainUpdateForm className='w-[400px]' />
      </DomainUpdateFormProvider>
      <DomainDeleteBox className='w-[400px]' id={domain.id} />
    </>
  );
};

export default DomainSettings;
