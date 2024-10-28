import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe) {
      return;
    }
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'process.env.NEXT_PUBLIC_CHANGE_PLAN_CALLBACK_URL' + '?success=true'
      },
    });
    if (result.error) {
      console.error(result);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div id='payment-element'>
        <PaymentElement />
      </div>
      <Button
        className='mt-4 w-full border border-border p-2 px-4 text-text hover:bg-surface'
        type='submit'
      >
        Submit
      </Button>
      <div id='error-message'></div>
    </form>
  );
};

export default CheckoutForm;
