require('dotenv').config();
console.log('Stripe key loaded:', process.env.STRIPE_SECRET_KEY ? 'Yes' : 'No');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testPayment() {
  // Create a test payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000, // $20.00
    currency: 'usd',
    payment_method_types: ['card'],
  });

  console.log('Payment Intent created:', paymentIntent.id);
  console.log('Client Secret:', paymentIntent.client_secret);
  
  // Confirm it immediately with test card
  const confirmed = await stripe.paymentIntents.confirm(paymentIntent.id, {
    payment_method: 'pm_card_visa', // Test card
  });

  console.log('Payment Status:', confirmed.status);
}

testPayment().catch(console.error);