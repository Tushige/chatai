'use client';
import { sendEmail } from '@/actions/campaign.action';
import FormBuilder from '@/components/forms/form-builder';
import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  EmailTemplateProps,
  EmailTemplateSchema,
} from '@/schemas/campaign.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

type Props = {
  recipients: string[];
  campaignId: string;
};

const CampaignEmailTemplate = ({ recipients, campaignId }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const methods = useForm<EmailTemplateProps>({
    resolver: zodResolver(EmailTemplateSchema),
  });
  const {
    register,
    formState: { errors },
  } = methods;
  const handleSubmit = async (data: EmailTemplateProps) => {
    try {
      setLoading(true);
      const { status } = await sendEmail({
        subject: data.subject,
        text: data.text,
        to: recipients,
        campaignId,
      });
      if (status === 200) {
        toast({
          title: <span className='text-success'>⭐Success</span>,
          description: 'Email Sent!',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to send',
        className: 'text-error',
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className='size-full py-12'>
        <Loader className='size-[30px]' />
      </div>
    )
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className='mt-8 flex flex-col gap-4'>
          <FormBuilder
            inputType='input'
            type='text'
            label='Subject'
            name='subject'
            placeholder='i.e. your weekly digest'
            register={register}
            errors={errors}
          />
          <FormBuilder
            inputType='textarea'
            type='text'
            name='text'
            label='Message'
            placeholder=''
            register={register}
            errors={errors}
          />
          <div className='mt-4 w-full'>
            <Button
              type='submit'
              className='w-full border border-border text-text hover:bg-surface'
            >
              Send
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default CampaignEmailTemplate;
