'use client';
import React from 'react';
import { Booking } from './booking.types';
import BookingTable from './booking-table/booking-table';
import { BookingTableColumns } from './booking-table/booking-table-columns';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const BookingsSummaryUI = ({ bookings }: { bookings: Booking[] }) => {
  if (!bookings || bookings.length < 1) {
    return <div className="text-text">😖 You have no upcoming appointments</div>;
  }
  return (
    <>
      <div className=''>
        <h2 className='text-2xl font-medium text-text-foreground'>Upcoming</h2>
        <p className='text-secondary mt-2 max-w-[42rem] text-sm lg:mt-4'>
          Showing your next 10 appointments
        </p>
      </div>
      <Separator className='mb-8 mt-4' />
      <div className='mb-2 flex w-full justify-end'>
        <Link className='text-text' href='/appointments/all'>
          See More
        </Link>
      </div>
      <BookingTable columns={BookingTableColumns} data={bookings} />
    </>
  );
};

export default BookingsSummaryUI;
