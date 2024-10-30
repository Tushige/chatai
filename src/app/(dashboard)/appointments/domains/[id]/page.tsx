import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getDomainWithContacts } from '@/actions/domain.action';
import { getBookingsByDomain } from '@/actions/bookings.action';
import BookingTable from '@/ui/bookings/booking-table/booking-table';
import { BookingTableColumns } from '@/ui/bookings/booking-table/booking-table-columns';

const AppointmentsPage = async ({ params }) => {
  const domainId = params.id;
  const appointments = await getBookingsByDomain(domainId);
  if (!appointments) {
    console.error('Appointments not found');
  }
  const domain = await getDomainWithContacts(domainId);
  return (
    <div className='h-full w-full'>
      <div className='container h-full px-4 pt-10 xl:px-8'>
        <Breadcrumb className='mb-4'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/appointments'>Domains</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='text-text-foreground'>
                {domain.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className='mb-8 flex flex-col'>
          <h2 className='text-2xl font-medium text-text-foreground'>
            Appointments
          </h2>
          <p className='text-secondary mt-2 max-w-[42rem] text-sm lg:mt-4'>
            Showing all of your scheduled appointments
          </p>
        </div>
        <BookingTable columns={BookingTableColumns} data={appointments} />
      </div>
    </div>
  );
};

export default AppointmentsPage;
