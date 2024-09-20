'use client'
import { useStepsContext } from "@/context/use-steps-context"
import { cn } from "@/lib/utils"

const FormProgressBar = () => {
  const {currentStep} = useStepsContext()

  return (
    <div className="grid grid-cols-3 gap-3 w-full">
     <Step step={1} currentStep={currentStep} />
     <Step step={2} currentStep={currentStep} />
     <Step step={3} currentStep={currentStep} />
    </div>
  )
}

function Step({step, currentStep}) {
  return (
    <div className={cn("rounded-full h-2 col-span-1 bg-surface", {'bg-accent': step <= currentStep})} />
  )
}
export default FormProgressBar