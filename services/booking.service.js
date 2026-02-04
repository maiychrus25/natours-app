const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tour.model');
const Booking = require('../models/booking.model');

exports.getCheckoutSession = async (tourId, user, protocol, host) => {
  // 1) Get the currently booked tour 
  const tour = await Tour.findById(tourId);

  // 2) Create checkout session 
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${protocol}://${host}/`,
    cancel_url: `${protocol}://${host}/tour/${tour.slug}/?tour=${tourId}&user=${user.id}&price=${tour.price}`,
    customer_email: user.email,
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

exports.createBooking = async (data) => {
  const booking = await Booking.create(data);
  return booking;
}

exports.getBookings = async () => {
  const bookings = await Booking.find();
  return bookings;
}

exports.getBooking = async (bookingId) => {
  const booking = await Booking.findById(bookingId);
  return booking;
}

exports.updateBooking = async (bookingId) => {
  const booking = await Booking.findByIdAndUpdate(bookingId, 
    { new: true, runValidators: true }
  );
  return booking;
}

exports.deleteBooking = async (bookingId) => {
  await Booking.findByIdAndDelete(bookingId);
}
