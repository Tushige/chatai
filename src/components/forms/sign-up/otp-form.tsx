'use client';
import OTPInput from '@/components/otp';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@hookform/error-message';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const OTPForm = () => {
  const {
    register,
    formState: { errors },
    getFieldState,
  } = useFormContext();
  const { setValue } = useFormContext();
  const [otp, setOtp] = useState('');
  const { isDirty } = getFieldState('otp');

  useEffect(() => {
    setValue('otp', otp);
  }, [otp, setValue]);

  return (
    <div>
      <h2 className='text-2xl font-bold text-text md:text-4xl'>Last Step</h2>
      <p className='text-text-secondary'>
        Enter the one-time password that was sent to your email.
      </p>
      <div className='flex w-full justify-center py-5'>
        <OTPInput otp={otp} setOtp={setOtp} register={register} />
      </div>
      <div className='w-full'>
        {isDirty && (
          <ErrorMessage
            errors={errors}
            name='otp'
            render={({ message }) => (
              <p className='mt-2 text-red-400'>{message}</p>
            )}
          />
        )}
      </div>
      <div className='w-full'>
        <Button
          className='w-full border border-border text-text hover:bg-surface'
          type='submit'
        >
          Create an account
        </Button>
      </div>
    </div>
  );
};
export default OTPForm;
