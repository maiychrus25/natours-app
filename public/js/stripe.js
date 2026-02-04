import axios from 'axios';
import { notify } from './alerts';
const stripe = Stripe('pk_test_51Sx5aXGtwIlReD6g4JLjdaVaCs7RWEJuAP82knd6z48F6gj1E3PP49OVjRXjN3Tq4ZQsfymFWEg5GNkCDKBUSK6g00O8vfm4Ij');

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from endpoint from API 
    const session = await axios({
      method: 'GET',
      url: `/api/v1/bookings/checkout-session/${tourId}`,
    });

    console.log(session);
    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });

  } catch (err) {
    notify.error('error', err);
  }
};
