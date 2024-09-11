'use client'
import { useFormContext } from "react-hook-form"
import FormBuilder from "../form-builder"
import { Button } from "@/components/ui/button"

const SigninForm = () => {
  const {register, formState: {errors}} = useFormContext()
  return (
    <div>
      <h2 className="text-lg md:text-2xl font-bold mb-4">
        Sign in to FINCENT AI
      </h2>
      <p className="text-sm">
        You will receive a one time password
      </p>
      <div className="flex flex-col gap-4 mt-4">
        <FormBuilder
          inputType="input"
          label="Email"
          name="email"
          placeholder="Enter your email"
          type="email"
          register={register}
          errors={errors}
        />
        <FormBuilder
          inputType="input"
          label="Password"
          name="password"
          placeholder="Enter your password"
          type="password"
          register={register}
          errors={errors}
        />
      </div>
      <div className="w-full mt-4">
        <Button
          type="submit"
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
export default SigninForm