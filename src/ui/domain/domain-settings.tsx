import DomainUpdateForm from "@/components/forms/domain/domain-update-form"
import DomainUpdateFormProvider from "@/components/forms/domain/domain-update-form-provider"
import DomainDeleteBox from "./domain-delete-box"

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
      <DomainUpdateFormProvider initialData={initialData} domainId={domain.id}>
        <DomainUpdateForm  className="w-[400px]"/>
      </DomainUpdateFormProvider>
      <DomainDeleteBox className="w-[400px]" id={domain.id}/>
    </>
  )
}

export default DomainSettings