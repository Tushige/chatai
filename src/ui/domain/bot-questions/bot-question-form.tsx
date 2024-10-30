'use client';
import FormBuilder from '@/components/forms/form-builder';
import { useToast } from '@/hooks/use-toast';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BotQuestionProps, BotQuestionSchema } from './bot-question.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { createBotQuestion } from '@/actions/questions.action';
import { updateChatbotBackstory } from '@/actions/chatbot.action';
import Loader from '@/components/loader';

type Props = {
  domainId: string;
  chatBotKitId: string;
};
const BotQuestionForm = ({ domainId, chatBotKitId }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const methods = useForm<BotQuestionProps>({
    resolver: zodResolver(BotQuestionSchema),
    mode: 'onChange',
  });
  const {
    register,
    formState: { errors },
  } = methods;
  const handleSubmit = async (data: BotQuestionProps) => {
    try {
      setLoading(true);
      const updatedQuestions = await createBotQuestion(data.question, domainId);
      await updateChatbotBackstory(chatBotKitId, updatedQuestions, domainId);
      toast({
        title: 'Success',
        description: 'Added new question',
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to create the question',
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className='py-12'>
        <Loader className='h-[30px] w-[30px]' />
      </div>
    );
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className='mt-4 flex flex-col gap-4'>
          <FormBuilder
            inputType='textarea'
            label='Question'
            name='question'
            placeholder='i.e. What are your business goals'
            type='text'
            register={register}
            errors={errors}
          />
        </div>
        <div className='mt-4 flex justify-end'>
          <Button
            className='bg-background text-text hover:bg-hover'
            type='submit'
          >
            Create
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default BotQuestionForm;
