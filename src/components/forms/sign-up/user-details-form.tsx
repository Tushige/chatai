import React from 'react'
import FormBuilder from '../form-builder'
import { useFormContext } from 'react-hook-form'
import { useStepsContext } from '@/context/use-steps-context'
import { Button } from '@/components/ui/button'
import { useSignUp } from '@clerk/nextjs'
import { useToast } from '@/hooks/use-toast'

const UserDetailsForm = () => {
  const {toast} = useToast()
  const { setCurrentStep } = useStepsContext()
  const { signUp, isLoaded } = useSignUp()
  const {register, formState, getFieldState, getValues} = useFormContext() 
  const {isDirty: fullnameDirty} = getFieldState('fullname', formState)
  const {isDirty: emailDirty} = getFieldState('email', formState)
  const {isDirty: passwordDirty} = getFieldState('password', formState)
  const {errors } = formState
  const generateOTP = async () => {
    if (fullnameDirty && emailDirty && passwordDirty && isLoaded) {
      try {
        await signUp?.create({
          emailAddress: getValues('email'),
          password: getValues('password')
        })
  
        await signUp?.prepareEmailAddressVerification({
          strategy: 'email_code'
        })
        setCurrentStep(prev => prev + 1)
      } catch (err) {
        toast({
          title: 'Error',
          description: err.errors[0].longMessage
        })
      }
    }
  }

  return (
    <div>
      <h2 className="text-lg md:text-2xl font-bold mb-12">
        Account Details
      </h2>
      <div className="flex flex-col gap-4">
        <FormBuilder
          inputType="input"
          name="fullname"
          label="Full Name"
          placeholder="Enter your first and last name"
          type="text"
          register={register}
          errors={errors}
        />
        <FormBuilder
          inputType="input"
          name="email"
          label="Email"
          placeholder="Enter your email"
          type="email"
          register={register}
          errors={errors}
        />
        <FormBuilder
          inputType="input"
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          register={register}
          errors={errors}
        />
        <FormBuilder
          inputType="input"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          type="password"
          register={register}
          errors={errors}
        />
      </div>
      <div className="mt-4">
        <Button
          type="submit"
          className="w-full"
          onClick={generateOTP}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

export default UserDetailsForm