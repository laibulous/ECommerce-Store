// ============================================
// src/components/checkout/CheckoutForm.jsx
// ============================================
import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { paymentService } from '../../services/paymentService';
import { Lock } from 'lucide-react';

const CheckoutForm = ({ orderId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    onError('');

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message);
        setLoading(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm payment with backend
        await paymentService.confirmPayment(paymentIntent.id, orderId);
        onSuccess(orderId);
      }
    } catch (err) {
      onError(err.response?.data?.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-primary w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Pay Now
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Your payment is secured by Stripe. We never store your card details.
      </p>
    </form>
  );
};

export default CheckoutForm;

