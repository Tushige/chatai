'use client';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  UserRegistrationProps,
  UserRegistrationSchema,
} from '@/schemas/auth.schema';
import { useToast } from '@/hooks/use-toast';
import { createUser } from '@/actions/user.action';
import Loader from '@/components/loader';
import { createCustomer, createFreeSubscription } from '@/actions/stripe';
import Stripe from 'stripe';

type Props = {
  children: React.ReactNode;
};
const COMPLETE = 'complete';

const SignupFormProvider = ({ children }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const { signUp, isLoaded, setActive } = useSignUp();
  const router = useRouter();

  const methods = useForm<UserRegistrationProps>({
    resolver: zodResolver(UserRegistrationSchema),
    defaultValues: {
      type: 'individual',
    },
    mode: 'onChange',
  });
  const {
    formState: { errors },
  } = methods;
  const handleSubmit = async (data: UserRegistrationProps) => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      const res = await signUp.attemptEmailAddressVerification({
        code: data.otp,
      });
      if (res.status === COMPLETE) {
        if (!signUp.createdUserId) {
          throw new Error('Failed to register');
        }
        // create customer on stripe
        const customer = await createCustomer({
          name: data.fullname,
          email: data.email,
        });
        // TODO - later on when we have our homepage, we will give users to option to choose a plan with the signup
        // But for now automatically subscribe the user to the free tier.
        await createFreeSubscription(customer.id);
        if (!customer) {
          throw new Error('Failed to create customer');
        }
        const registered = await createUser({
          fullname: data.fullname,
          email: data.email,
          clerkId: signUp.createdUserId,
          type: data.type,
          stripeCustomerId: customer.id
        });
        if (registered?.status === 200 && registered?.user) {
          await setActive({
            session: res.createdSessionId,
          });
          router.push('/dashboard');
        } else {
          toast({
            title: <span className='error'>Error</span>,
            description: 'Something went wrong.',
          });
          setLoading(false);
        }
      } else {
        toast({
          title: <span className='error'>Error</span>,
          description: 'Something went wrong. Please try again',
        });
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: <span className='text-error'>Error</span>,
        description: 'An error occured. Please try again',
      });
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

export default SignupFormProvider;
