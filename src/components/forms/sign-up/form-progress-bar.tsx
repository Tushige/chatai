'use client';
import { useStepsContext } from '@/context/use-steps-context';
import { cn } from '@/lib/utils';

const FormProgressBar = ({ className }: { className?: string }) => {
  const { currentStep } = useStepsContext();
  return (
    <div className={cn('grid w-full grid-cols-3 gap-3', className)}>
      <Step step={1} currentStep={currentStep} />
      <Step step={2} currentStep={currentStep} />
      <Step step={3} currentStep={currentStep} />
    </div>
  );
};

function Step({ step, currentStep }) {
  return (
    <div
      className={cn('col-span-1 h-2 rounded-full bg-surface', {
        'bg-accent': step <= currentStep,
      })}
    />
  );
}
export default FormProgressBar;
