import DomainUpdateForm from "@/components/forms/domain/domain-update-form"
import DomainUpdateFormProvider from "@/components/forms/domain/domain-update-form-provider"
import DomainDeleteBox from "./domain-delete-box"
import { Separator } from "@/components/ui/separator"
import SectionTitle from "@/components/app-section-title"

type Props = {
  domain: any
}
const DomainSettings = ({
  domain
}: Props) => {
  const initialData = {
    icon: domain.icon,
    name: domain.name,
    welcomeMessage: domain.chatBot.welcomeMessage
  }
  return (
    <>
      <SectionTitle 
        title="Domain Settings"
        description="update your domain info"
      />
      <Separator className="mb-8"/>
      <DomainUpdateFormProvider initialData={initialData} domainId={domain.id}>
        <DomainUpdateForm  className="w-[400px]"/>
      </DomainUpdateFormProvider>
      <DomainDeleteBox className="w-[400px]" id={domain.id}/>
    </>
  )
}

export default DomainSettings