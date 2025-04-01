'use client'
import { useCart } from '@/app/context/CartContext';
import { Progress } from '@/components/ui/progress';
import { createOrder } from '@/services/orderService';
import { getUser, User } from '@/services/userService';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function Page() {
    const { cart } = useCart();
    const [user, setUser] = useState<User | null>(null);
    const session = useSession();
    const [step, setStep] = useState<number>(0);
    const searchParams = useSearchParams();
    const [orderCreated, setOrderCreated] = useState<boolean>(false);
  
    useEffect(() => { 
        const fetchUser = async () => {
            try {
                const userData = await getUser(session.data?.user?.email || '');
                setUser(userData);
                setTimeout(() => setStep(1), 2000);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
    
        if (session.data?.user?.email) {
            fetchUser();
        }
    }, [session.data?.user?.email]);

    useEffect(() => {
        if (user && !orderCreated) {
            handleCreateOrder();
        }
    }, [user]);

    async function handleCreateOrder() {
        if (!user || orderCreated) return;
        setOrderCreated(true);

        setTimeout(() => setStep(1), 1000);
        const items = cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            observation: item.observation
        }));

        const paymentMethod = searchParams.get('paymentMethod');
        let troco = searchParams.get('troco') || "";
        const newAddress = searchParams.get('newAddress') || "";
        if (troco && !troco.includes("R$")) {
            troco = `R$${troco}`;
        }

        

        const paymentDescriptions: Record<string, string> = {
            cartao: "Pago online com cartão de crédito",
            entrega: "Pagamento na entrega",
            pix: "Pago online com Pix",
        };

        const paymentText = paymentDescriptions[paymentMethod ?? ""] || "Método de pagamento não reconhecido";

        // add observations from each item (item.observation)
        await createOrder(
            user?.userId || '',
            user?.telephone || '',
            user?.name || '',
            user?.email || '',
            newAddress ? newAddress : user?.address || '',
            items,
            cart.reduce((acc, product) => acc + product.price * product.quantity, 0) + 10,
            paymentText || '',
            "Pendente",
            troco || '',
            
        );

        // empty the cart
        cart.length = 0;
        setTimeout(() => setStep(2), 2000);
        setTimeout(() => redirect('/pedidos'), 200);
    }

    return (
        <div className='flex flex-col w-full h-[90vh] overflow-hidden items-center justify-center gap-4'>
            <div className='flex flex-col justify-center items-center'>
                {step === 0 ? (
                    <>
                        <Image src={'/credit-card.png'} width={40} height={40} alt='' />
                        <br />
                        <Progress value={33} />
                        <br />
                        <h1>Pedido enviado!</h1>
                    </>
                ) : step === 1 ? (
                    <>
                        <Image src={'/delivery.png'} width={40} height={40} alt='' />
                        <br />
                        <Progress value={50} />
                        <br />
                        <h1>Processando pedido</h1>
                    </>
                ) : (
                    <>
                        <Image src={'/shopping-bag.png'} width={40} height={40} alt='' />
                        <br />
                        <Progress value={100} />
                        <br />
                        <h1>Pedido processado!</h1>
                    </>
                )}
            </div>
        </div>
    );
}

export default Page;
