import { getAllDomains } from '@/actions/domain.action';
import AppPageTitle from '@/components/app-page-title';
import AppSectionContainer from '@/components/app-section-container';
import AppSectionHeroContainer from '@/components/app-section-hero-container';
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const AppointmentsAllPage = async () => {
  const domains = await getAllDomains();
  return (
    <div className='flex flex-col'>
      <AppSectionHeroContainer>
        <AppPageTitle
          title='Appointments'
          description='Organize your appointments and track them effectively here'
        />
      </AppSectionHeroContainer>
      <AppSectionContainer>
        {!domains || domains.length < 1 ? (
          <div className='text-secondary text-medium text-secondary text-center lg:mt-[200px]'>
            Create a Domain first and then come back
          </div>
        ) : (
          <>
            <h3 className='text-secondary'>
              Select a domain too see appointments
            </h3>
            <Separator className='mb-8 mt-4 border-border' />
            <ul className='flex flex-col gap-4'>
              {domains.map((domain) => {
                return (
                  <Link
                    key={domain.key}
                    href={`/appointments/domains/${domain.id}`}
                    className='flex flex-row items-center gap-2'
                  >
                    <span className='underline'>{domain.name}</span>
                    <ArrowRight className='size-4' />
                  </Link>
                );
              })}
            </ul>
          </>
        )}
      </AppSectionContainer>
    </div>
  );
};

export default AppointmentsAllPage;
