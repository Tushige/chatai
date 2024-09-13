'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ErrorMessage } from '@hookform/error-message'
import React from 'react'
import { FieldErrors, FieldValues } from 'react-hook-form'

type Props = {
  register: any,
  errors: FieldErrors<FieldValues>
}

const FileUploadInput = ({
  register,
  errors
}: Props) => {
  return (
    <div>
      <Label
        htmlFor="upload-button"
        className="rounded-md flex flex-col gap-2 items-start cursor-pointer"
      >
        <span>
          ChatBot Icon
        </span>
        <Input 
          {...register('icon')}
          type="file"
          id="upload-button"
          name="icon"
          defaultValue={undefined}
          // className="hidden"
        />
      </Label>
      <p className="text-sm mt-2">
        Recommended size is 300px * 300px, size <br /> less than 2MB
      </p>
      <ErrorMessage
        errors={errors}
        name="icon"
        render={({ message }) => (
          <p className="text-red-400 mt-2">
            {message}
          </p>
        )}
      />
    </div>
  )
}

export default FileUploadInput