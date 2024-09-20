'use client'
import { useFormContext } from "react-hook-form"
import FormBuilder from "../form-builder"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const SigninForm = () => {
  const {register, formState: {errors}} = useFormContext()
  return (
    <div>
      <h2 className="font-bold text-text text-2xl md:text-4xl">
        Sign in to FINCENT AI
      </h2>
      <p className="text-sm text-text-secondary mt-4">
        Don't have an account? <Link href="/auth/sign-up" className="underline hover:text-text-foreground">Sign Up</Link>
      </p>
      <div className="flex flex-col gap-4 mt-8">
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
          className="w-full border border-border text-text hover:bg-surface"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
export default SigninForm