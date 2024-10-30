import { cn } from '@/lib/utils';
import BookAppointmentForm from '@/ui/bookings/booking-form/book-appointment-form';
import React from 'react';

const PortalPage = ({ params }) => {
  const domainId = params.id;
  return (
    <div className='flex h-[100vh] w-full flex-col items-center bg-background'>
      <PortalPageHeader domainId={domainId} />
    </div>
  );
};

function PortalPageHeader({
  className,
  domainId,
}: {
  domainId: string;
  className?: string;
}) {
  return (
    <div className={cn('justify-left my-8 flex flex-col', className)}>
      <div className='mb-8'>
        <h1 className='mb-4 text-4xl text-text'>Book your appointment</h1>
        <p className='max-w-[400px] text-sm text-text-secondary'>
          This meeting is an opportunity for us to understand your specific
          needs and explore how our solutions can best meet them. We look
          forward to collaborating with you to identify the right fit for your
          requirements.
        </p>
      </div>
      <BookAppointmentForm domainId={domainId} />
    </div>
  );
}
export default PortalPage;
