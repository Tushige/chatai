'use client'
import { Card, CardDescription } from '@/components/ui/card'
import React, { useState } from 'react'
import {
  UserIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { FieldValues, useFormContext, UseFormRegister } from 'react-hook-form'
import { UserType } from '@/schemas/auth.schema'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useStepsContext } from '@/context/use-steps-context'

const UserTypeForm = () => {
  const { register } = useFormContext()
  const { setCurrentStep, currentStep } = useStepsContext()
  const [userType, setUserType] = useState<UserType>('individual')
  return (
    <div>
      <h2 className="font-bold text-text text-2xl md:text-4xl">
        Create an Account
      </h2>
      <p className="text-sm text-text-secondary mt-4">
        What type of account would you like?
      </p>
      <div className="flex flex-col gap-4 mt-8">
        <UserTypeCard
          title="Business"
          description="I want to set up an account for my business"
          value="business"
          selectedUserType={userType}
          setSelectedUserType={setUserType}
          register={register}
        />
        <UserTypeCard
          title="Individual"
          description="I want to set up an account for myself"
          value="individual"
          selectedUserType={userType}
          setSelectedUserType={setUserType}
          register={register}
        />
      </div>
      <div className="mt-4">
        <Button
          type="submit"
          className="w-full text-text border border-border hover:bg-surface"
          onClick={() => setCurrentStep(prev => prev + 1)}
        >
          Continue
        </Button>
        <div className="flex flex-row gap-2 mt-4">
          <p className="text-medium text-text">Already have an account?</p>
          <Link
            href="/auth/sign-in"
            className="font-bold underline text-text"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}


function UserTypeCard({
  title,
  description,
  value,
  selectedUserType,
  setSelectedUserType,
  register
}: {
  title: string,
  description: string,
  value: string,
  selectedUserType: string,
  setSelectedUserType: React.Dispatch<React.SetStateAction<'business' | 'individual'>>,
  register: UseFormRegister<FieldValues>,
}) {
  return (
    <Label htmlFor={value}>
      <Card className={cn(
        "flex justify-between items-center p-2 px-3 cursor-pointer", 
        {'border-accent': selectedUserType === value}
      )}>
        <div className="flex items-center gap-4 px-4 py-2">
          <UserIcon className={cn("w-12 text-text", {'text-accent': selectedUserType === value})} />
          <div>
            <CardDescription className="text-text">
              {title}
            </CardDescription>
            <CardDescription className="text-text-secondary">
              {description}
            </CardDescription>
          </div>
        </div>
        <div>
          <div className={cn("w-4 h-4 rounded-full")}>
            {
              selectedUserType === value ? (
                <CheckIcon className="w-6 h-6 text-accent"/>
              ) : null
            }
            <Input
              {
                ...register('type', {
                  onChange: event => {
                    setSelectedUserType(event.target.value)
                  }
                })
              }
              value={value}
              id={value}
              className="hidden"
              type="radio"
            />
          </div>
        </div>
      </Card>  
    </Label>
  )
}
export default UserTypeForm