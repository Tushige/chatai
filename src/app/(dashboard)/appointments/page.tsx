import { getBookingsSummary } from '@/actions/bookings.action'
import { getAllDomains } from '@/actions/domain.action'
import AppPageTitle from '@/components/app-page-title'
import BookingsSummaryUI from '@/ui/bookings/bookings-summary'
import React from 'react'

const AppointmentsPage = async () => {
  const bookings = await getBookingsSummary()
  return (
    <div className="w-full">
      <AppPageTitle title="Bookings" description="Organize your customer bookings and track them effectively here"/>
      <BookingsSummaryUI bookings={bookings}/>
    </div>
  )
}

export default AppointmentsPage