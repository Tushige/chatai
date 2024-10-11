'use client'
import React from 'react'
import { Booking } from './booking.types'
import BookingTable from './booking-table/booking-table'
import { BookingTableColumns } from './booking-table/booking-table-columns'
import AppSectionTitle from '@/components/app-section-title'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const BookingsSummaryUI = ({
  bookings
}: {
  bookings: Booking[]
}) => {
  if (!bookings || bookings.length < 1) {
    return <div>You have no bookings</div>
  }
  return (
    <>
      <div className="">
        <h2 className="font-medium text-2xl text-text-foreground">Upcoming</h2>
        <p className="mt-2 lg:mt-4 max-w-[42rem] text-sm text-secondary">Showing your next 10 appointments</p>
      </div>
      <Separator className="mt-4 mb-8" />
      <div className="w-full flex justify-end mb-2">
        <Link className="text-text" href="/appointments/all">
          See More
        </Link>
      </div>
      <BookingTable columns={BookingTableColumns} data={bookings}/>
    </>
  )
}

export default BookingsSummaryUI