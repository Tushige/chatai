'use client'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import FormBuilder from '../form-builder'
import FileUploadInput from './file-upload-input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'


type Props = {
  className?: string
}
const DomainUpdateForm = ({
  className
}: Props) => {
  const {register, formState, getFieldState} = useFormContext()
  const {errors} = formState

  const {isDirty: nameDirty} = getFieldState('name', formState)
  const {isDirty: iconDirty} = getFieldState('icon', formState)
  const {isDirty: welcomeMessageDirty} = getFieldState('welcomeMessage', formState)

  return (
    <div className={cn(className)}>
      <FormBuilder
        type="text"
        inputType="input"
        label="Domain Name"
        placeholder=""
        register={register}
        name="name"
        errors={errors}
      />
      <div className="mt-4">
        <FileUploadInput register={register} errors={errors}/>
      </div>
      <div className="mt-2">
        <Label htmlFor="welcomeMessage">
          Chatbot Greeting Message
          <p className="text-sm text-muted">
            The message the chatbot will greet clients with.
          </p>
          <Textarea
            id="welcomeMessage"
            className="mt-2"
            placeholder="Your chatbot default greeting message"
            {...register('welcomeMessage')}
          />
        </Label>
      </div>
      <Button
        type="submit"
        disabled={!nameDirty && !iconDirty && !welcomeMessageDirty}
        className="w-full mt-4 bg-background text-foreground text-medium rounded-md flex flex-row gap-2 flex-start hover:bg-surface"
      >
        Save
      </Button>
    </div>
  )
}

export default DomainUpdateForm