'use client';
import { updateDomain } from '@/actions/domain.action';
import Loader from '@/components/loader';
import { useToast } from '@/hooks/use-toast';
import { uploadCareUpload } from '@/lib/upload-care';
import { DomainSchema, DomainUpdateProps } from '@/schemas/domain.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const DomainUpdateFormProvider = ({
  domainId,
  initialData,
  children,
}: {
  domainId: string;
  initialData?: DomainUpdateProps;
  children: React.ReactNode;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const methods = useForm<DomainUpdateProps>({
    resolver: zodResolver(DomainSchema),
    defaultValues: {
      ...initialData,
      icon: undefined,
    },
  });
  const handleSubmit = async (data: DomainUpdateProps) => {
    try {
      setLoading(true);
      if (data.icon) {
        const uploadCareImage = await uploadCareUpload(data.icon[0]);
        data.icon = uploadCareImage.uuid;
      }
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(
          ([, value]) => value !== null && value !== undefined
        )
      );
      await updateDomain(domainId, cleanedData);
      toast({
        title: '⭐Success',
        description: `${data.name} successfully updated`,
      });
      router.refresh();
    } catch (err) {
      console.error('failed updating domain with error: ', err);
      toast({
        title: 'Error',
        description: 'Something went wrong! Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          {loading ? (
            <div className='py-12'>
              <Loader className='h-[30px] w-[30px]' />
            </div>
          ) : (
            children
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default DomainUpdateFormProvider;
