import {useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button';

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit =  async (e) => {
    e.preventDefault()
    if (!stripe) {
      return;
    }
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/settings/membership/change-plan?success=true'
      }
    })
    if (result.error) {
      console.error(result)
    } 
  }
  return (
    <form onSubmit={handleSubmit}>
      <div id="payment-element">
        <PaymentElement />
      </div>
      <Button
        className="w-full text-text border border-border hover:bg-surface p-2 px-4 mt-4"
        type="submit"
      >
        Submit
      </Button>
      <div id="error-message">

      </div>
    </form>
  )
}

export default CheckoutForm;