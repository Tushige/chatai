import { StepsProvider } from '@/context/use-steps-context';
import { cn } from '@/lib/utils'
import BookAppointmentForm from '@/ui/bookings/booking-form/book-appointment-form'
import React from 'react'

const PortalPage = ({
  params
}) => {
  const domainId = params.id;
  return (
    <div className="flex flex-col items-center bg-background w-full h-[100vh]">
      <PortalPageHeader domainId={domainId}/>
    </div>
  )
}

function PortalPageHeader({
  className,
  domainId
}: {
  domainId: string,
  className?: string
}) {
  return (
    <div className={cn("my-8 flex flex-col justify-left", className)}>
      <div className="mb-8">
        <h1 className="text-text text-4xl mb-4">
          Book your appointment
        </h1>
        <p className="text-text-secondary text-sm max-w-[400px]">
          This meeting is an opportunity for us to understand your specific needs and explore how our solutions can best meet them. We look forward to collaborating with you to identify the right fit for your requirements.
        </p>
      </div>
      <BookAppointmentForm domainId={domainId}/>
    </div>
  )
}
export default PortalPage