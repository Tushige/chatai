'use client'
import FormBuilder from '@/components/forms/form-builder'
import { useToast } from '@/hooks/use-toast'
import React, { useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { BotQuestionProps, BotQuestionSchema } from './bot-question.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'
import { createBotQuestion } from '@/actions/questions.action'
import { revalidatePath } from 'next/cache'

type Props = {
  domainId: string
}
const BotQuestionForm = ({
  domainId
}: Props) => {
  const {toast} = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const methods = useForm<BotQuestionProps>({
    resolver: zodResolver(BotQuestionSchema),
    mode: 'onChange'
  })
  const {register, formState: {errors}} = methods
  const handleSubmit = async (data: BotQuestionProps) => {
    try {
      console.log('submitting bot question')
      console.log(data)
      setLoading(true)
      const res = await createBotQuestion(data.question, domainId)
      toast({
        title: 'Success',
        description: 'Added new question'
      })
      // TODO - save the question to chatbotkit
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Failed to create the question'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-4 mt-4">
          <FormBuilder
            inputType="textarea"
            label="Question"
            name="question"
            placeholder="i.e. What are your business goals"
            type="text"
            register={register}
            errors={errors}
          />
        </div>
        <div className="flex justify-between mt-4">
          <Link href={`/domains/${domainId}`} className="flex">
            <ArrowLongLeftIcon className="size-6"/>
            Go Back
          </Link>
          <Button
            className="bg-background hover:bg-hover text-text"
            type="submit"
          >
            Create
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default BotQuestionForm