'use client'
import React, { useState } from 'react'
import UserTypeForm from '@/components/forms/sign-up/user-type-form'
import { useStepsContext } from '@/context/use-steps-context'
import UserDetailsForm from './user-details-form'
import OTPForm from './otp-form'

const RegistrationSteps = () => {
  const {currentStep} = useStepsContext()

  switch (currentStep) {
    case 1:
      return (
        <UserTypeForm />
      )
    case 2: 
      return (
        <UserDetailsForm />
      )
    case 3:
      return (
        <OTPForm />
      )
  }
}

export default RegistrationSteps