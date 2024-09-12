import React from 'react'
import FormBuilder from '../form-builder'
import { useFormContext } from 'react-hook-form'
import FileUploadInput from './file-upload-input'
import { Button } from '@/components/ui/button'

const DomainAddForm = () => {
  const {register, formState} = useFormContext()
  const {errors} = formState
  return (
    <div className="mt-4">
      <FormBuilder 
        type="text"
        inputType="input"
        label="Domain address"
        placeholder="www.example-domain.com"
        name="name"
        register={register}
        errors={errors}
      />
      <div className="mt-4">
        <FileUploadInput register={register} errors={errors}/>
      </div>
      <Button type="submit" className="w-full mt-4 bg-background text-foreground text-medium rounded-md flex flex-row gap-2 flex-start hover:bg-muted">
        Add Domain
      </Button>
    </div>
  )
}

export default DomainAddForm