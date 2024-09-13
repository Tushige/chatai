/**
 * Domain 
 * - this component is responsible for creating new Domains
 */
'use client'
import DomainAddForm from "@/components/forms/domain/domain-add-form"
import DomainAddFormProvider from "@/components/forms/domain/domain-add-form-provider"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Domain } from "@/schemas/domain.schema"
import { PlusIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import Link from "next/link"


function DomainMenu({
  domains
}: {
  domains: Domain[] | null | undefined
}) {
  return (
    <>
      <DomainCreateForm/>
      <ul>
        {
          domains?.map(domain => {
            return (
              <li
                key={domain.id}
                className="m-auto p-8 w-fit rounded-full md:rounded-none md:w-full cursor-pointer hover:bg-muted">
                <Link
                  href={`/domains/${domain.id}`}
                  className="flex flex-row justify-center md:justify-start gap-2"
                >
                  <Image
                    src={`https://ucarecdn.com/${domain.icon}/-/preview/64x64`}
                    width="24"
                    height="24"
                    alt={`logo for the domain ${domain.name}`}
                    unoptimized
                  />
                  <span className="hidden md:inline-block">
                    {domain.name}
                  </span>
                </Link>
              </li>
            )
          })
        }
      </ul>
    </>
  )
}

function DomainCreateForm() {
  return (
    <Drawer>
      <div className="flex justify-center md:justify-between items-center p-4">
        <span className="hidden md:inline-block">Domains</span>
        <DrawerTrigger className="bg-background rounded-full hover:bg-muted p-2">
          <PlusIcon className="w-6 text-foreground" />
        </DrawerTrigger>
      </div>
      <DrawerContent className="pb-12">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              Create a Domain
            </DrawerTitle>
            <DrawerDescription>
              Each chatbot will be associated with a domain
            </DrawerDescription>
            <DomainAddFormProvider>
              <DomainAddForm />
            </DomainAddFormProvider>
          </DrawerHeader>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
export {
  DomainMenu
}