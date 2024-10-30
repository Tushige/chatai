'use client';
import { useFormContext } from 'react-hook-form';
import FormBuilder from '../form-builder';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const SigninForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div>
      <h2 className='text-2xl font-bold text-text md:text-4xl'>
        Sign in to Chat AI
      </h2>
      <p className='mt-4 text-sm text-text-secondary'>
        Don&apos;t have an account?{' '}
        <Link href='/sign-up' className='underline hover:text-text-foreground'>
          Sign Up
        </Link>
      </p>
      <div className='mt-8 flex flex-col gap-4'>
        <FormBuilder
          inputType='input'
          label='Email'
          name='email'
          placeholder='Enter your email'
          type='email'
          register={register}
          errors={errors}
        />
        <FormBuilder
          inputType='input'
          label='Password'
          name='password'
          placeholder='Enter your password'
          type='password'
          register={register}
          errors={errors}
        />
      </div>
      <div className='mt-4 w-full'>
        <Button
          type='submit'
          className='w-full border border-border text-text hover:bg-surface'
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
export default SigninForm;
