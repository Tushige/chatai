'use client'
import { sendEmail } from '@/actions/campaign.action'
import FormBuilder from '@/components/forms/form-builder'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { EmailTemplateProps, EmailTemplateSchema } from '@/schemas/campaign.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

type Props = {
  recipients: string[]
}

const CampaignEmailTemplate = ({
  recipients
}: Props) => {
  const {toast} = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const methods = useForm<EmailTemplateProps>({
    resolver: zodResolver(EmailTemplateSchema)
  })
  const {register, formState: {errors}} = methods
  const handleSubmit = async (data: EmailTemplateProps) => {
    try {
      setLoading(true)
      const {status} = await sendEmail({
        subject: data.subject,
        text: data.text,
        to: recipients
      })
      if (status === 200) {
        toast({
          title: <span className="text-success">⭐Success</span>,
          description: 'Email Sent!'
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to send',
        className: 'text-error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-4 mt-8">
          <FormBuilder
            inputType="input"
            type="text"
            label="Subject"
            name="subject"
            placeholder="i.e. your weekly digest"
            register={register}
            errors={errors}
          />
          <FormBuilder
            inputType="textarea"
            type="text"
            name="text"
            label="Message"
            placeholder=""
            register={register}
            errors={errors}
          />
          <div className="w-full mt-4">
            <Button
              type="submit"
              className="w-full border border-border text-text hover:bg-surface"
            >
              Send
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default CampaignEmailTemplate