'use client';
import { Card, CardDescription } from '@/components/ui/card';
import React, { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { FieldValues, useFormContext, UseFormRegister } from 'react-hook-form';
import { UserType } from '@/schemas/auth.schema';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useStepsContext } from '@/context/use-steps-context';
import { BriefcaseBusiness, SquareUser } from 'lucide-react';

const UserTypeForm = () => {
  const { register } = useFormContext();
  const { setCurrentStep, currentStep } = useStepsContext();
  const [userType, setUserType] = useState<UserType>('individual');
  return (
    <div>
      <h2 className='text-2xl font-bold text-text md:text-4xl'>
        Create an Account
      </h2>
      <p className='mt-4 text-sm text-text-secondary'>
        What type of account would you like?
      </p>
      <div className='mt-8 flex flex-col gap-4'>
        <UserTypeCard
          title='Business'
          description='I want to set up an account for my business'
          value='business'
          selectedUserType={userType}
          setSelectedUserType={setUserType}
          register={register}
          CardIcon={BriefcaseBusiness}
        />
        <UserTypeCard
          title='Individual'
          description='I want to set up an account for myself'
          value='individual'
          selectedUserType={userType}
          setSelectedUserType={setUserType}
          register={register}
          CardIcon={SquareUser}
        />
      </div>
      <div className='mt-4'>
        <Button
          type='submit'
          className='w-full border border-border text-text hover:bg-surface'
          onClick={() =>
            setCurrentStep((prev) => {
              return prev + 1;
            })
          }
        >
          Continue
        </Button>
        <div className='mt-4 flex flex-row gap-2'>
          <p className='text-medium text-text'>Already have an account?</p>
          <Link href='/sign-in' className='font-bold text-text underline'>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

function UserTypeCard({
  title,
  description,
  value,
  selectedUserType,
  setSelectedUserType,
  register,
  CardIcon
}: {
  title: string;
  description: string;
  value: string;
  selectedUserType: string;
  setSelectedUserType: React.Dispatch<
    React.SetStateAction<'business' | 'individual'>
  >;
  register: UseFormRegister<FieldValues>;
}) {
  return (
    <Label htmlFor={value}>
      <Card
        className={cn(
          'flex cursor-pointer items-center justify-between p-2 px-3',
          { 'border-accent': selectedUserType === value }
        )}
      >
        <div className='flex items-center gap-4 px-4 py-2'>
          <CardIcon
            className={cn('w-12 text-text', {
              'text-accent': selectedUserType === value,
            })}
          />
          <div>
            <CardDescription className='text-text'>{title}</CardDescription>
            <CardDescription className='text-text-secondary'>
              {description}
            </CardDescription>
          </div>
        </div>
        <div>
          <div className={cn('h-4 w-4 rounded-full')}>
            {selectedUserType === value ? (
              <CheckIcon className='h-6 w-6 text-accent' />
            ) : null}
            <Input
              {...register('type', {
                onChange: (event) => {
                  setSelectedUserType(event.target.value);
                },
              })}
              value={value}
              id={value}
              className='hidden'
              type='radio'
            />
          </div>
        </div>
      </Card>
    </Label>
  );
}
export default UserTypeForm;
