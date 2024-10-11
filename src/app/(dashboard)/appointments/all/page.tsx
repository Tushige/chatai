import { getAllDomains } from '@/actions/domain.action'
import AppPageTitle from '@/components/app-page-title'
import { Separator } from '@/components/ui/separator'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const AppointmentsAllPage = async () => {
  const domains = await getAllDomains()
  return (
    <div className="flex flex-col">
      <AppPageTitle title="Appointments" description="Organize your appointments and track them effectively here"/>
      {
        !domains || domains.length < 1 ? (
          <div className="lg:mt-[200px] text-secondary text-medium text-center text-secondary">
            Create a Domain first and then come back
          </div>
        ) : (
          <>
            <h3 className="text-secondary">
              Select a domain too see appointments
            </h3>
            <Separator className="border-border mt-4 mb-8"/>
            <ul className="flex flex-col gap-4">
              {
                domains.map(domain => {
                  return (
                    <Link
                      key={domain.key}
                      href={`/appointments/domains/${domain.id}`}
                      className="flex flex-row gap-2 items-center"
                    >
                      <span className="underline">{domain.name}</span>
                      <ArrowRight className="size-4"/>
                    </Link>
                  )
                })
              }
            </ul>
          </>
        )
      }
    </div>
  )
}

export default AppointmentsAllPage