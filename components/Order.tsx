import React from 'react';
import Box from './ui/box';
import Image from 'next/image';
import { Button } from './ui/button';
import { Loader, AlertCircle, LucideClock, LucideCheckCircle, LucideXCircle, LucideAlertCircle } from 'lucide-react';

// Definindo as cores e animações para cada status
const statusConfig = {
    Pendente: { color: 'bg-amber-400', icon: <LucideClock className="w-4 h-4" /> },
    Preparo: { color: 'bg-blue-400', icon: <Loader className="w-4 h-4 animate-spin" /> },
    Entregue: { color: 'bg-green-400', icon: <LucideCheckCircle className="w-4 h-4" /> },
    Cancelado: { color: 'bg-red-400', icon: <LucideXCircle className="w-4 h-4" /> },
    Entrega: { color: 'bg-purple-400', icon: <LucideAlertCircle className="w-4 h-4" /> },
};

// Estilos CSS para a animação de piscar
const styles = `
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
    .blinking-dot {
        animation: blink 1s infinite;
    }
`;

export default function OrderComponent({
    orderId,
    createdAt,
    items,
    totalValue,
    status,
    paymentMethod,
    troco,
}: {
    orderId: string,
    paymentMethod: string,
    troco: string,
    createdAt: string,
    items: Array<{
        id: string,
        name: string,
        quantity: number,
        price: number,
        observation?: string | "sem observações"
    }>,
    totalValue: number,
        status: keyof typeof statusConfig,
    observation?: string,
}) {
    const { color, icon } = statusConfig[status] || { color: 'bg-gray-400', icon: <AlertCircle className="w-4 h-4" /> };

    return (
        <Box>
            {/* Adicionando os estilos CSS */}
            <style>{styles}</style>

            <div className='w-full h-full flex flex-col gap-8'>
                <h1 className='font-semibold flex gap-2 text-sm'>
                    <Image
                        src={'/order.png'}
                        width={25}
                        height={25}
                        alt='order-icon'
                    />
                    Pedido nº {orderId} - {createdAt}
                </h1>
                {items && items.length > 0 ? (
                    items.map((item) => (
                        <div key={item.id} className="flex flex-col items-start gap-2">
                            <h1 className="font-semibold">{item.name}</h1>
                            <p className="font-semibold">Qnt.: {item.quantity}</p>
                            <p className="font-semibold">R${item.price}</p>
                            <p className="font-semibold">Obs.:{item.observation}</p>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col center justify-center">
                        <Loader />
                    </div>
                )}

                <h1 className='font-semibold flex gap-2 text-sm'>
                    <Image
                        src={'/money.png'}
                        width={25}
                        height={25}
                        alt='order-icon'
                    />
                    Valor Total: R${totalValue}, {" "}
                    troco para {troco}

                </h1>
                <h1 className='font-semibold flex gap-2 text-sm'>
                    Forma de Pagamento: {paymentMethod}
                </h1>
                <div className='flex gap-2 items-center justify-center pl-2'>
                    {/* Pontinho que pisca */}
                    <div className={`${color} w-2 h-2 rounded-full blinking-dot`} />
                    <p className='text-sm flex items-center gap-2'>
                        {icon} {status}
                    </p>
                </div>
                {
                    status === 'Cancelado' ? (
                        <Button>Entre em contato</Button>
                    ) : (
                    <Button disabled>Cancelar</Button>
                    )
                }
            </div>
        </Box>
    );
}