'use client'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import {UserRegistrationProps, UserRegistrationSchema} from '@/schemas/auth.schema'
import { useToast } from '@/hooks/use-toast'
import { createUser } from '@/actions/user.action'
import Loader from '@/components/loader'

type Props = {
  children: React.ReactNode
}
const COMPLETE = 'complete'

const SignupFormProvider = ({children}: Props) => {
  const {toast} = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const {signUp, isLoaded, setActive} = useSignUp()
  const router = useRouter()

  const methods = useForm<UserRegistrationProps>({
    resolver: zodResolver(UserRegistrationSchema),
    defaultValues: {
      type: 'individual'
    },
    mode: 'onChange'
  })
  const {formState: {errors}} = methods;
  const handleSubmit = async (data: UserRegistrationProps) => {
    if (!isLoaded) return

    try {
      setLoading(true)
      const res = await signUp.attemptEmailAddressVerification({
        code: data.otp
      })
      if (res.status === COMPLETE) {
        if (!signUp.createdUserId) return
        const registered = await createUser(
          data.fullname,
          signUp.createdUserId,
          data.type
        )
        if (registered?.status === 200 && registered?.user) {
          await setActive({
            session: res.createdSessionId
          })
          setLoading(false)
          router.push('/dashboard')
        }
        if (registered?.status === 400) {
          toast({
            title: 'ERROR',
            description: 'Something went wrong.'
          })
        }
      } else {
        return {
          message: 'Something went wrong. Please try again'
        }
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err.errors[0].longMessage
      })
    }
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="h-full">
        {
          loading ? (
            <Loader />
          ) : (
            children
          )
        }
      </form>
    </FormProvider>
  )
}

export default SignupFormProvider