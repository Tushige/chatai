'use client';
import { createCampaign } from '@/actions/campaign.action';
import FormBuilder from '@/components/forms/form-builder';
import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CampaignProps, CampaignSchema } from '@/schemas/campaign.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

type Props = {
  initialData?: CampaignProps;
  onSuccess: () => void;
  closeDrawer: () => void;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  domainId: string;
};

const CampaignAddForm = ({
  initialData,
  onSuccess,
  closeDrawer,
  loading,
  setLoading,
  domainId,
}: Props) => {
  const { toast } = useToast();
  const router = useRouter();

  const methods = useForm<CampaignProps>({
    resolver: zodResolver(CampaignSchema),
    defaultValues: initialData,
  });
  const handleSubmit = async (data: CampaignProps) => {
    try {
      setLoading(true);
      await createCampaign({
        name: data.name,
        description: data.description,
        domainId,
      });
      onSuccess();
      router.refresh();
      toast({
        title: <span className='text-success'>⭐Success</span>,
        description: 'Campaign created',
      });
    } catch (err) {
      toast({
        title: <span className="text-error">Error</span>,
        description: 'Failed to create a campaign',
      });
    } finally {
      setLoading(false);
    }
  };
  const {
    register,
    formState: { errors },
  } = methods;

  if (loading) {
    <div className='size-full py-12'>
      <Loader className='h-[30px] w-[30px]' />
    </div>
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className='mt-4 flex flex-col gap-4'>
          <FormBuilder
            type='text'
            inputType='input'
            label='Campaign Name'
            placeholder='i.e. your weekly newsletter'
            name='name'
            register={register}
            errors={errors}
          />
          <FormBuilder
            type='text'
            inputType='textarea'
            label='Campaign Description'
            name='description'
            placeholder='...'
            register={register}
            errors={errors}
          />
        </div>
        <div className='flex items-end justify-between gap-2'>
          <Button
            type='button'
            onClick={closeDrawer}
            className='border-none bg-transparent text-text shadow-none hover:bg-transparent'
          >
            Cancel
          </Button>
          <Button
            type='submit'
            className='flex-start mt-4 flex w-full flex-row gap-2 rounded-md bg-background text-text hover:bg-surface hover:text-text-foreground'
          >
            Create Campaign
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default CampaignAddForm;
