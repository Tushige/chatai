/**
 * Domain 
 * - this component is responsible for creating new Domains
 */
'use client'
import DomainAddForm from "@/components/forms/domain/domain-add-form"
import DomainAddFormProvider from "@/components/forms/domain/domain-add-form-provider"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { PlusIcon } from "@heroicons/react/24/outline"
import { Domain } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"


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
                className="m-auto p-4 w-fit rounded-full lg:rounded-none lg:w-full cursor-pointer hover:bg-muted">
                <Link
                  href={`/domains/${domain.id}`}
                  className="flex flex-row justify-center lg:justify-start gap-2"
                >
                  <Image
                    src={`https://ucarecdn.com/${domain.icon}/-/preview/64x64`}
                    width="24"
                    height="24"
                    alt={`logo for the domain ${domain.name}`}
                    unoptimized
                  />
                  <span className="hidden lg:inline-block">
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
  const [open, setOpen] = useState(false)
  return (
    <Drawer open={open}>
      <div className="flex justify-center lg:justify-between items-center p-4">
        <span className="hidden lg:inline-block">Domains</span>
        <Button className="bg-background rounded-full hover:bg-muted p-2" onClick={() => setOpen(true)}>
          <PlusIcon className="w-6 text-foreground" />
        </Button>
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
            <DomainAddFormProvider onSuccess={() => setOpen(false)}>
              <DomainAddForm closeDrawer={() => setOpen(false)} />
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