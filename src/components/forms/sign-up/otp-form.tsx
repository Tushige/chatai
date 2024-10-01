'use client'
import OTPInput from "@/components/otp"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ErrorMessage } from "@hookform/error-message"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

const OTPForm = () => {
  const {register, formState: {errors}, getFieldState} = useFormContext()
  const {setValue} = useFormContext()
  const [otp, setOtp] = useState('')
  const {isDirty} = getFieldState('otp')
  console.log(isDirty)
  useEffect(() => {
    setValue('otp', otp)
  }, [otp])
  return (
    <div>
      <h2 className="font-bold text-2xl text-text md:text-4xl">
        Last Step
      </h2>
      <p className="text-text-secondary">
        Enter the one-time password that was sent to your email.
      </p>
      <div className="w-full justify-center flex py-5">
        <OTPInput
          otp={otp}
          setOtp={setOtp}
          register={register}
        />
      </div>
      <div className="w-full">
        {
          isDirty && (
            <ErrorMessage
              errors={errors}
              name="otp"
              render={({message}) => (
                <p className="text-red-400 mt-2">
                  {message}
                </p>
              )}
            />
          )
        }
      </div>
      <div className="w-full">
        <Button className="w-full text-text border border-border hover:bg-surface" type="submit">
          Create an account
        </Button>
      </div>
    </div>
  )
}
export default OTPForm