'use client'
import { createCampaign } from '@/actions/campaign.action'
import FormBuilder from '@/components/forms/form-builder'
import Loader from '@/components/loader'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { CampaignProps, CampaignSchema } from '@/schemas/campaign.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { revalidatePath } from 'next/cache'
import { useRouter } from 'next/navigation'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

type Props = {
  initialData?: CampaignProps,
  onSuccess: () => void,
  closeDrawer: () => void,
  loading: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>,
  domainId: string
}

const CampaignAddForm = ({
  initialData,
  onSuccess,
  closeDrawer,
  loading,
  setLoading,
  domainId
}: Props) => {
  const {toast} = useToast()
  const router = useRouter()

  const methods = useForm<CampaignProps>({
    resolver: zodResolver(CampaignSchema),
    defaultValues: initialData
  })
  const handleSubmit = async (data: CampaignProps) => {
    try {
      setLoading(true)
      await createCampaign({
        name: data.name,
        description: data.description,
        domainId
      })
      revalidatePath('/')
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create a campaign'
      })
    } finally {
      setLoading(false)
    }
  }
  const {register, formState: {errors}} = methods

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="mt-4 flex flex-col gap-4">
          <FormBuilder
            type="text"
            inputType="input"
            label="Campaign Name"
            placeholder="i.e. your weekly newsletter"
            name="name"
            register={register}
            errors={errors}
          />
          <FormBuilder
            type="text"
            inputType="textarea"
            label="Campaign Description"
            name="description"
            placeholder="..."
            register={register}
            errors={errors}
          />
        </div>
        <div className="flex justify-between items-end gap-2">
          <Button
            type="button"
            onClick={closeDrawer}
            className="bg-transparent text-text border-none shadow-none hover:bg-transparent "
          >
            Cancel
          </Button>
          <Button type="submit" className="w-full mt-4 bg-background text-text rounded-md flex flex-row gap-2 flex-start hover:bg-surface hover:text-text-foreground">
            Create Campaign
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default CampaignAddForm