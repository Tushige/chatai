import FormProgressBar from '@/components/forms/sign-up/form-progress-bar';
import SignupFormProvider from '@/components/forms/sign-up/form-provider';
import RegistrationSteps from '@/components/forms/sign-up/registration-steps';
import { StepsProvider } from '@/context/use-steps-context';
import React from 'react';

const page = () => {
  return (
    <div className='flex h-full w-full flex-col gap-3 py-8 lg:py-36 md:px-16'>
      <SignupFormProvider>
        <StepsProvider>
          <div className='mb-8 w-full'>
            <RegistrationSteps />
          </div>
          <FormProgressBar />
        </StepsProvider>
      </SignupFormProvider>
    </div>
  );
};

export default page;
