import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';


function formatarCentavosParaReais(centavos: number) {
  const reais = centavos / 100;
  return reais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function CheckoutElement({
    amount,
    newAddress,
}: { amount: number, newAddress?: string, isAddressWithinRadius: boolean | null, observation?: string }) {
    const stripe = useStripe();
    const elements = useElements()

    const [errorMessage, setErrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount }),
        }).then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
    }, [amount])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        
        if (!stripe || !elements) {
            return;
        }

        const { error: submitError } = await elements.submit();

        if (submitError) {
            setErrorMessage(submitError.message);
            setLoading(false);
            return;
        }
        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart/checkout/return/sucess?amount=${amount}&paymentMethod=cartao${newAddress ? `&newAddress=${encodeURIComponent(newAddress)}` : ''}`,
            }
        })
        if (error) {
            setErrorMessage(error.message);
            setLoading(false);
            return;
        }
    }
  return (
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 bg-white/80 p-4 rounded-md'>
          {clientSecret && <PaymentElement />}
          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
          <Button disabled={!stripe || loading} className={`cursor-pointer h-12 ${loading ? 'bg-blue-800 hover:bg-blue-900' : 'bg-black'} border border-white/30 transition transform ease-in-out`}>{
          !loading ? `Pagar ${formatarCentavosParaReais(amount)}` :  "Processando"
          }
          </Button>
    </form>
  )
}
