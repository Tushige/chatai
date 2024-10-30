'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from '@hookform/error-message';
import React from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

type Props = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
};

const FileUploadInput = ({ register, errors }: Props) => {
  return (
    <div>
      <Label
        htmlFor='upload-button'
        className='flex cursor-pointer flex-col items-start gap-2 rounded-md text-text'
      >
        <span>ChatBot Icon</span>
        <Input
          {...register('icon')}
          className='font- text-text file:text-text'
          type='file'
          id='upload-button'
          name='icon'
          defaultValue={undefined}
          // className="hidden"
        />
      </Label>
      <p className='mt-2 text-sm text-text'>
        Recommended size is 300px * 300px, size <br /> less than 2MB
      </p>
      <ErrorMessage
        errors={errors}
        name='icon'
        render={({ message }) => <p className='mt-2 text-red-400'>{message}</p>}
      />
    </div>
  );
};

export default FileUploadInput;
