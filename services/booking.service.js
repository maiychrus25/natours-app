const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tour.model');

exports.getCheckoutSession = async (tourId, email, protocol, host) => {
  // 1) Get the currently booked tour 
  const tour = await Tour.findById(tourId);

  // 2) Create checkout session 
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${protocol}://${host}/`,
    cancel_url: `${protocol}://${host}/tour/${tour.slug}`,
    customer_email: email,
    client_reference_id: tourId,
    line_items: [ 
      {
        price_data: {
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [tour.imageCover],
          },
          unit_amount: tour.price * 100,
          currency: 'usd',
        },
        quantity: 1,
      }
    ],
    mode: 'payment'
  });

  // 3) Create session as response
  return session;
}
