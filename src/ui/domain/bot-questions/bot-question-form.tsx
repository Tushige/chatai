'use client'
import FormBuilder from '@/components/forms/form-builder'
import { useToast } from '@/hooks/use-toast'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { BotQuestionProps, BotQuestionSchema } from './bot-question.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'
import { createBotQuestion } from '@/actions/questions.action'
import { updateChatbotBackstory } from '@/actions/chatbot.action'

type Props = {
  domainId: string,
  chatBotKitId: string
}
const BotQuestionForm = ({
  domainId,
  chatBotKitId
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
      setLoading(true)
      const updatedQuestions = await createBotQuestion(data.question, domainId)
      await updateChatbotBackstory(chatBotKitId, updatedQuestions)
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
        <div className="flex justify-end mt-4">
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