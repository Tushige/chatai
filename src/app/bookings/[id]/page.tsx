import { getBooking } from '@/actions/bookings.action'
import { dateWithTime } from '@/components/app-date'
import { ConfettiFireworks } from '@/components/app-fireworks'
import DotPattern from '@/components/magicui/dot-pattern'
import { cn } from '@/lib/utils'
import React from 'react'

const BookingPage = async ({
  params
}) => {
  const bookingId = params.id
  if (!bookingId) {
    return <div>404</div>
  }
  const booking = await getBooking(bookingId)
  if (!booking) {
    return  <div>404</div>
  }
  const time = dateWithTime(booking.date)
  return (
    <div className="flex flex-col w-full h-full justify-center items-center bg-background text-text">
      <DotPattern
            className={cn(
              "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
            )}
          />
      <h1 className="text-4xl mb-4">
        You're All Set!
      </h1>
      <p>
        You're booked for {time}
      </p>
    </div>
  )
}

export default BookingPage