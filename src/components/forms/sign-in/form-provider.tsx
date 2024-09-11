'use client'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { AuthContextProvider } from '@/context/use-auth-context'
import {UserRegistrationProps, UserRegistrationSchema, UserSigninProps, UserSigninSchema} from '@/schemas/auth.schema'
import { useToast } from '@/hooks/use-toast'
import { onCompleteUserRegistration } from '@/actions/user'
import Loader from '@/components/loader'

type Props = {
  children: React.ReactNode
}
const COMPLETE = 'complete'

const SigninFormProvider = ({children}: Props) => {
  const {toast} = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const {signIn, isLoaded, setActive} = useSignIn()
  const router = useRouter()

  const methods = useForm<UserSigninProps>({
    resolver: zodResolver(UserSigninSchema),
    mode: 'onChange'
  })

  const handleSubmit = async (data: UserSigninProps) => {
    if (!isLoaded) {
      // TODO - handle loading state
      return
    }
    try {
      setLoading(true)
      const authenticated = await signIn.create({
        identifier: data.email,
        password: data.password
      })
      if (authenticated.status === COMPLETE) {
        await setActive({session: authenticated.createdSessionId})
        toast({
          title: 'Success',
          description: 'Welcome back!'
        })
        router.push('/dashboard')
      }
    } catch (err) {
      if (err.errors[0].code === 'form_password_incorrect') {
        toast({
          title: 'Error',
          description: 'email or password is incorrect. Please try again.'
        })
      }
    } finally {
      setLoading(false)
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

export default SigninFormProvider