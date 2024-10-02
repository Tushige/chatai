import { motion } from "framer-motion";
import { GradientText } from "@/components/app-gradient-text";
import { Separator } from "@/components/ui/separator";
import { CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SheetTrigger } from "@/components/ui/sheet";

const MembershipPlanCard = ({
  premium,
  priceId,
  name,
  unitAmount,
  features,
  className,
  onClick,
  currentPrice
}: {
  premium: boolean,
  priceId: string,
  name: string,
  unitAmount: number,
  features: string[],
  onClick: any,
  currentPrice: any
}) => {
  const isCurrentPlan = currentPrice && currentPrice.id === priceId
  return (
    <div
      className={cn(className)}
    >
      <h2>
        {
          premium ? (
            <GradientText className="text-2xl font-medium">
              {name}
            </GradientText>
          ) : (
            <span className="text-2xl font-medium">{name}</span>
          )
        }
      </h2>
      <div className="flex flex-row gap-4 items-center">
        <div className="flex flex-row items-start mt-4">
          <span className="text-md">
            $
          </span>
          <motion.span
            className="text-4xl font-bold"
          >
            {unitAmount / 100.0}
          </motion.span>
          <span className="self-end">/ per month</span>
        </div>
      </div>
      <ul className="mt-4">
        {
         features.map( (feature, idx) => (
          <li key={idx} className="flex flex-col">
            <div className="flex flex-row gap-2 py-2">
              <CheckCircleIcon className="w-4" />
              <span className="text-sm text-secondary">{feature}</span>
            </div>
            <Separator className="border-border"/>
          </li>
         )) 
        }
      </ul>
      <div className="w-full flex flex-row justify-center">
        <SheetTrigger>
          <Button
            className="mt-8 bg-accent hover:bg-accent-hover text-text hover:drop-shadow-2xl"
            onClick={() => onClick(priceId)}
            disabled={isCurrentPlan}
          >
            {
              isCurrentPlan ? 'Current plan' : 'Subscibe'
            }
          </Button>
        </SheetTrigger>
      </div>
    </div>
  )
}

export default MembershipPlanCard;