'use client'
import Loader from '@/components/loader'
import { DomainProps, DomainSchema } from '@/schemas/domain.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

type Props = {
  children: React.ReactNode
}

const DomainUpdateForm = ({children}: Props) => {
  const [loading, setLoading] = useState<boolean>(false)

  const methods = useForm<DomainProps>({
    resolver: zodResolver(DomainSchema)
  })
  const handleSubmit = (data: DomainProps) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
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

export default DomainUpdateForm