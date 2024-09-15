import React from 'react'
import FormBuilder from '../form-builder'
import { useFormContext } from 'react-hook-form'
import FileUploadInput from './file-upload-input'
import { Button } from '@/components/ui/button'

const DomainAddForm = ({
  closeDrawer
}) => {
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
      <FormBuilder
        type="text"
        inputType="input"
        label="ChatBot Name"
        placeholder="What do you wanna name your bot?"
        name="botName"
        register={register}
        errors={errors}
        className="mt-2"
      />
      <div className="mt-4">
        <FileUploadInput register={register} errors={errors}/>
      </div>
      <div className="flex justify-between items-end gap-2">
        <Button
          type="button"
          onClick={closeDrawer}
          className="bg-transparent text-foreground border-none shadow-none hover:bg-transparent "
        >
          Cancel
        </Button>
        <Button type="submit" className="w-full mt-4 bg-background text-foreground text-medium rounded-md flex flex-row gap-2 flex-start hover:bg-muted hover:text-black">
          Add Domain
        </Button>
      </div>
    </div>
  )
}

export default DomainAddForm