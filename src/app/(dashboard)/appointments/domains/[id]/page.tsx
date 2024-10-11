import AppPageTitle from '@/components/app-page-title'
import AppSectionTitle from '@/components/app-section-title'
import EmailTable from '@/ui/campaigns/email-table'
import EmailTableColumns from '@/ui/campaigns/email-table/email-table-columns'
import React, { useState } from 'react'
import { getCampaign } from '@/actions/campaign.action'
import { Separator } from '@/components/ui/separator'
import CampaignEmailTemplate from '@/ui/campaigns/campaign-email-template'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getDomainWithContacts } from '@/actions/domain.action'
import { getBookingsByDomain } from '@/actions/bookings.action'
import BookingTable from '@/ui/bookings/booking-table/booking-table'
import { BookingTableColumns } from '@/ui/bookings/booking-table/booking-table-columns'

const AppointmentsPage = async ({
  params,
}) => {
  const domainId = params.id
  const appointments = await getBookingsByDomain(domainId)
  if (!appointments) {
    console.error('Appointments not found')
  }
  const domain = await getDomainWithContacts(domainId)
  return (
    <div className="w-full h-full">
      <div className="container h-full pt-10 px-4 xl:px-8">
        <Breadcrumb className="mb-4">
        <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/appointments">Domains</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-text-foreground">{domain.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-col mb-8">
          <h2 className="font-medium text-2xl text-text-foreground">Appointments</h2>
          <p className="mt-2 lg:mt-4 max-w-[42rem] text-sm text-secondary">Showing all of your scheduled appointments</p>
        </div>
        <BookingTable columns={BookingTableColumns} data={appointments}/>
      </div>
    </div>
  )
}

export default AppointmentsPage