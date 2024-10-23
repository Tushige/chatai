import { getBookingsSummary } from '@/actions/bookings.action';
import { getAllDomains } from '@/actions/domain.action';
import AppPageTitle from '@/components/app-page-title';
import AppSectionContainer from '@/components/app-section-container';
import AppSectionHeroContainer from '@/components/app-section-hero-container';
import BookingsSummaryUI from '@/ui/bookings/bookings-summary';
import React from 'react';

const AppointmentsPage = async () => {
  const bookings = await getBookingsSummary();
  return (
    <div className='w-full'>
      <AppSectionHeroContainer>
        <AppPageTitle
          title='Appointments'
          description='Organize your customer appointments and track them effectively here'
        />
      </AppSectionHeroContainer>
      <AppSectionContainer>
        <BookingsSummaryUI bookings={bookings} />
      </AppSectionContainer>
    </div>
  );
};

export default AppointmentsPage;
