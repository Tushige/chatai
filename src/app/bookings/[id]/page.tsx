'use client';
import { getBooking } from '@/actions/bookings.action';
import { ConfettiFireworks } from '@/components/app-fireworks';
import Loader from '@/components/loader';
import DotPattern from '@/components/magicui/dot-pattern';
import { dateWithTime } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { Booking } from '@prisma/client';
import React, { useEffect, useState } from 'react';

const BookingPage = ({ params }) => {
  const bookingId = params.id;
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    (async () => {
      const booking = await getBooking(bookingId);
      setLoading(false);
      setBooking(booking);
    })();
  }, [bookingId])  

  if (loading) {
    return (
      <div className='w-full py-12'>
        <Loader className='size-[30px]' />
      </div>
    );
  }
  
  if (!booking) {
    return <div className="w-full flex justify-center">404</div>;
  }
  const time = dateWithTime(booking.date);
  return (
    <div className='flex h-full w-full flex-col items-center justify-center bg-background text-text'>
      <DotPattern
        className={cn(
          '[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]'
        )}
      />
       
      <ConfettiFireworks active={!!booking}/>
      <h1 className='mb-4 text-4xl'>You&apos;re All Set!</h1>
      <div className='w-full h-full flex justify-center items-center text-center text-md relative z-1'>  
        <div className="border border-border rounded-md p-4 bg-background text-sm">
          You&apos;re booked for {time}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
