'use client';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { UserSigninProps, UserSigninSchema } from '@/schemas/auth.schema';
import { useToast } from '@/hooks/use-toast';
import Loader from '@/components/loader';

type Props = {
  children: React.ReactNode;
};
const COMPLETE = 'complete';

const SigninFormProvider = ({ children }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();

  const methods = useForm<UserSigninProps>({
    resolver: zodResolver(UserSigninSchema),
    mode: 'onChange',
  });

  const handleSubmit = async (data: UserSigninProps) => {
    if (!isLoaded) {
      // TODO - handle loading state
      return;
    }
    try {
      setLoading(true);
      const authenticated = await signIn.create({
        identifier: data.email,
        password: data.password,
      });
      if (authenticated.status === COMPLETE) {
        await setActive({ session: authenticated.createdSessionId });
        toast({
          title: <span className='text-success'>Success</span>,
          description: 'Welcome back!',
          className: 'text-success',
        });
        router.push('/dashboard');
      }
    } catch (err) {
      if (err.errors[0].code === 'form_password_incorrect') {
        toast({
          title: <span className='text-error'>Error</span>,
          description: 'email or password is incorrect. Please try again.',
        });
      } else {
        toast({
          title: <span className='text-error'>Error</span>,
          description: 'Something went wrong. Please try again.',
        });
      }
      setLoading(false);
    }
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className='h-full'>
        {loading ? <Loader /> : children}
      </form>
    </FormProvider>
  );
};

export default SigninFormProvider;
