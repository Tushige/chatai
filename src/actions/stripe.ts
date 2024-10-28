import Stripe from 'stripe';

export const stripeClient = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET!);

export const getPrices = async (productId: string) => {
  try {
    const prices = await stripeClient.prices.list({
      active: true,
      product: productId,
    });
    return prices;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const getPrice = async (id: string) => {
  try {
    const price = await stripeClient.prices.retrieve(id);
    return price;
  } catch (err) {
    console.error(err);
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
    const productId = price.product;
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
  } catch (err) {
    console.error(err);
    throw new Error(err);
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
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

/**
 * we update the subscription with the new plan and return payment intent back to the client.
 * payment intent allows to defer the payment to later.
 * On the client, we collect the payment info and complete the transaction.
 */
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
    );
    const returnVal = {
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent?.client_secret,
      invoice_status: subscription.latest_invoice.status,
      payment_intent_status: subscription.latest_invoice.payment_intent?.status
    };
    return returnVal;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
/**
 *
 */
export const createPortalSession = async (customerId: string) => {
  try {
    const portalSession = await stripeClient.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.NEXT_PUBLIC_MEMBERSHIP_URL,
    });
    return portalSession;
  } catch (err) {
    console.error('Failed creating customer portal session');
    console.error(err);
    throw new Error(err);
  }
};

export const createCustomer = async ({ name, email }) => {
  try {
    const customer = await stripeClient.customers.create({
      name,
      email: 'test1@gmail.com',
    });
    return customer;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
