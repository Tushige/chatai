'use client';
import React, {useState } from 'react';
import { createDomain } from '@/actions/user.action';
import Loader from '@/components/loader';
import { useToast } from '@/hooks/use-toast';
import { uploadCareUpload } from '@/lib/upload-care';
import { DomainProps, DomainSchema } from '@/schemas/domain.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import FormBuilder from '../form-builder';
import { FormProvider, useForm } from 'react-hook-form';
import FileUploadInput from './file-upload-input';
import { Button } from '@/components/ui/button';

type Props = {
  initialData?: DomainProps;
  onSuccess: () => void;
  closeDrawer: () => void;
};

const DomainAddForm = ({ initialData, onSuccess, closeDrawer }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const methods = useForm<DomainProps>({
    resolver: zodResolver(DomainSchema),
    defaultValues: initialData,
  });
  const handleSubmit = async (data: DomainProps) => {
    try {
      setLoading(true);
      // 1. upload the icon to Upload Care
      let iconId = null;
      if (data.icon) {
        const uploadCareImage = await uploadCareUpload(data.icon[0]);
        iconId = uploadCareImage.uuid;
      }
      await createDomain({
        name: data.name,
        botName: data.botName,
        icon: iconId,
      });
      toast({
        title: '⭐Success',
        description: `${data.name} successfully added`,
        className: 'text-success',
      });
      onSuccess();
      router.refresh();
    } catch (err) {
      console.error('failed creating domain with error: ', err);
      toast({
        title: 'Error',
        description: 'Something went wrong! Please try again.',
        className: 'text-error',
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
    return (
      <div className='py-12'>
        <Loader className='size-[30px]' />
      </div>
    );
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className='mt-4'>
          <FormBuilder
            type='text'
            inputType='input'
            label='Domain address'
            placeholder='www.example-domain.com'
            name='name'
            register={register}
            errors={errors}
          />
          <FormBuilder
            type='text'
            inputType='input'
            label='ChatBot Name'
            placeholder='What do you wanna name your bot?'
            name='botName'
            register={register}
            errors={errors}
            className='mt-2'
          />
          <div className='mt-4'>
            <FileUploadInput register={register} errors={errors} />
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
              Add Domain
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default DomainAddForm;
