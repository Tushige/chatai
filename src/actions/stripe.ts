import Stripe from 'stripe';

export const stripeClient = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET!);

export const getPrices = async (productId: string) => {
  try {
    const prices = await stripeClient.prices.list({
      active: true,
      product: productId,
    });
    return prices;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to fetch prices';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};

export const getPrice = async (id: string) => {
  try {
    const price = await stripeClient.prices.retrieve(id);
    return price;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to fetch price';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};
export const getAvailablePrices = async (customerId: string) => {
  try {
    // 1. fetch subscription for a given customer
    const subscription = await stripeClient.subscriptions.list({
      customer: customerId,
    });
    if (!subscription) {
      throw new Error('Failed to fetch subscription');
    }
    // this is the selected price the user is on. we grab the containing product and fetch all prices associated with this product.
    const price = subscription.data[0].items.data[0].price;
    const productId = price.product as string;
    const prices = await getPrices(productId);
    if (!prices || !prices.data) {
      throw new Error('Expected prices but got nothing');
    }
    return {
      subscriptionId: subscription.data[0].id,
      prices: prices.data,
      subscriptionItemId: subscription.data[0].items.data[0].id,
      currentPrice: price,
      currentPeriodEnd: subscription.data[0].current_period_end,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to fetch available prices';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};

// we subscribe new users to the free plan by default.
export const createFreeSubscription = async (customerId: string) => {
  try {
    const subscription = await stripeClient.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_FREE_PLAN_ID,
        },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
    });

    if (!subscription) {
      throw new Error('Failed to create a free subscription');
    }
    return subscription;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to create free subscription';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};

/**
 * we update the subscription with the new plan and return payment intent back to the client.
 * payment intent allows us to defer the payment to later.
 * On the client, we collect the payment info and complete the transaction.
 * if default payment is stored on Stripe already, then no payment intent is returned and the payment is immediately processed
 */

type ExpandedSubscription = Stripe.Subscription & {
  latest_invoice?: Stripe.Invoice & {
    payment_intent?: Stripe.PaymentIntent;
  };
};

export const updateSubscription = async (
  customerId: string,
  subscriptionId: string,
  subscriptionItemId: string,
  priceId: string
) => {
  try {
    const subscription = await stripeClient.subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: subscriptionItemId,
            price: priceId,
            quantity: 1,
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      }
    ) as ExpandedSubscription;
    
    const returnVal = {
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      invoice_status: subscription.latest_invoice?.status,
      payment_intent_status: subscription.latest_invoice?.payment_intent?.status
    };
    return returnVal;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to update subscription';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};

export const createCustomer = async ({ name, email }: {name: string, email: string}) => {
  try {
    const customer = await stripeClient.customers.create({
      name,
      email,
    });
    return customer;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to create customer';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};
