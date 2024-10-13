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
/**
 *
 * We don't have a use case where customer id is null.
 * flow: customer browses available plan and select a plan. We call this method with the select price's id and the customer id.
 * customer will be redirected to stripe hosted checkout page where they'll complete the purchase
 *
 * This is no longer used, we're going with custom form instead
 */
export const createCheckoutSession = async (
  priceId: string,
  customerId: string
) => {
  try {
    const session = await stripeClient.checkout.sessions.create({
      billing_address_collection: 'auto',
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `http://localhost:3000/settings/membership/change-plan?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/settings/membership`,
    });
    return session;
  } catch (err) {
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
 * we update the subscription with the new plan and return payment intent back to the client
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
      payment_intent_status:
        subscription.latest_invoice.payment_intent?.status ||
        subscription.latest_invoice.status === 'paid'
          ? 'succeeded'
          : null,
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
      return_url: `http://localhost:3000/settings/membership`,
    });
    return portalSession;
  } catch (err) {
    console.error('***Failed creating customer portal session');
    console.error(err);
    throw new Error(err);
  }
};

export const createCustomer = async ({ name, email }) => {
  try {
    const customer = await stripeClient.customers.create({
      name,
      email,
    });
    return customer;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
