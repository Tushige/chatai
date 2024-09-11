import FormProgressBar from '@/components/forms/sign-up/form-progress-bar'
import SignupFormProvider from '@/components/forms/sign-up/form-provider'
import RegistrationSteps from '@/components/forms/sign-up/registration-steps'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col w-full h-full gap-3 py-36 md:px-16">
      <SignupFormProvider>
        <div className="w-full mb-8">
          <RegistrationSteps />
        </div>
        <FormProgressBar/>
      </SignupFormProvider>
    </div>
  )
}

export default page