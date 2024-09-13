'use client'
import { createDomain } from '@/actions/user'
import Loader from '@/components/loader'
import { useToast } from '@/hooks/use-toast'
import { uploadCareUpload } from '@/lib/upload-care'
import { DomainProps, DomainSchema } from '@/schemas/domain.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

const DomainAddFormProvider = ({initialData, onSuccess, children}: {
  initialData?: DomainProps,
  onSuccess: Function,
  children: React.ReactNode
}) => {
  const {toast} = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  
  const methods = useForm<DomainProps>({
    resolver: zodResolver(DomainSchema),
    defaultValues: initialData
  })
  const handleSubmit = async (data: DomainProps) => {
    try {
      setLoading(true)
      // 1. upload the icon to Upload Care
      let iconId = null
      if (data.icon) {
        const uploadCareImage = await uploadCareUpload(data.icon[0])
        iconId = uploadCareImage.uuid
      }
      const {status, message} = await createDomain({
        name: data.name,
        icon: iconId
      })
      if (status === 200) {
        toast({
          title: 'Success',
          description: `${data.name} successfully added`
        })
        onSuccess()
        router.refresh()
      } else {
        toast({
          title: 'Error',
          description: message
        })
      }
    } catch (err) {
      console.error('failed creating domain with error: ', err)
      toast({
        title: 'Error',
        description: 'Something went wrong! Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          {
            loading ? (
              <div className="py-12">
                <Loader className="w-[30px] h-[30px]"/>
              </div>
            ) : (
              children
            )
          }
        </form>
      </FormProvider>
    </div>
  )
}

export default DomainAddFormProvider