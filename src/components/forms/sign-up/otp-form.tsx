'use client'
import OTPInput from "@/components/otp"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ErrorMessage } from "@hookform/error-message"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

const OTPForm = () => {
  const {register, formState: {errors}} = useFormContext()
  const {setValue} = useFormContext()
  const [otp, setOtp] = useState('')

  useEffect(() => {
    setValue('otp', otp)
  }, [otp])
  return (
    <div>
      <h2 className="font-bold text-2xl md:text-4xl">
        Last Step
      </h2>
      <p>
        Enter the one-time password that was sent to your email.
      </p>
      <div className="w-full justify-center flex py-5">
        <OTPInput
          otp={otp}
          setOtp={setOtp}
        />
      </div>
      <div className="w-full">
        <ErrorMessage
          errors={errors}
          name="otp"
          render={({message}) => (
            <p className="text-red-400 mt-2">
              {message}
            </p>
          )}
        />
      </div>
      <div className="w-full">
        <Button className="w-full" type="submit">
          Create an account
        </Button>
      </div>
    </div>
  )
}
export default OTPForm