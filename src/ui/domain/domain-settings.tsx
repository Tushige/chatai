import DomainUpdateForm from "@/components/forms/domain/domain-update-form"
import DomainUpdateFormProvider from "@/components/forms/domain/domain-update-form-provider"

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
    <DomainUpdateFormProvider initialData={initialData} domainId={domain.id}>
      <DomainUpdateForm />
    </DomainUpdateFormProvider>
  )
}

export default DomainSettings