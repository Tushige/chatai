'use client'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { AuthContextProvider } from '@/context/use-auth-context'
import {UserRegistrationProps, UserRegistrationSchema} from '@/schemas/auth.schema'
import { useToast } from '@/hooks/use-toast'
import { createUser } from '@/actions/user'
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
    console.log("HANDLE SUBMIT CALLED")
    console.log(data)
    if (!isLoaded) return

    try {
      setLoading(true)
      const res = await signUp.attemptEmailAddressVerification({
        code: data.otp
      })
      console.log('[FORM] Complete')
      console.log(res)
      if (res.status === COMPLETE) {
        if (!signUp.createdUserId) return
        console.log('[FORM] creating user in db')
        const registered = await createUser(
          data.fullname,
          signUp.createdUserId,
          data.type
        )
        console.log('user created')
        console.log(registered)
        if (registered?.status === 200 && registered?.user) {
          console.log(`setting active session`)
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
    <AuthContextProvider>
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
    </AuthContextProvider>
  )
}

export default SignupFormProvider