'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { listenToOrders, Order, updateOrderStatus } from '@/services/orderService';
import { Printer, CheckCircle, XCircle, Truck, PackageCheck, Phone } from 'lucide-react';

const getElapsedTime = (createdAt: string) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} segundos atrás`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutos atrás`;
  return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
};

const getCardColor = (status: Order['status']) => {
  const colors: Record<Order['status'], string> = {
    Pendente: 'bg-white',
    Preparo: 'bg-yellow-50',
    Entrega: 'bg-blue-50',
    Entregue: 'bg-green-50',
    Cancelado: 'bg-red-50',
  };
  return colors[status];
};

const printOrder = (order: Order) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Pedido #${order.orderId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
          h1 { margin-bottom: 10px; }
          .logo { width: 150px; margin: 0 auto 20px; }
          .order-details { margin-bottom: 20px; text-align: left; }
          .items { border-top: 1px solid #000; padding-top: 10px; text-align: left; }
        </style>
      </head>
      <body>
        <img src='/logo.png' alt='Empresa' class='logo' />
        <h1>Pedido #${order.orderId}</h1>
        <div class='order-details'>
          <p><strong>Cliente:</strong> ${order.name}</p>
          <p><strong>Email:</strong> ${order.email}</p>
          <p><strong>Endereço:</strong> ${order.address}</p>
          <p><strong>Total:</strong> R$ ${order.totalValue.toFixed(2)}</p>
          <p><strong>Forma de Pagamento:</strong> R$ ${order.paymentMethod}</p>

        </div>
        <div class='items'>
          <h2>Itens do Pedido</h2>
          <ul>
            ${order.items.map(item => `<li>${item.quantity}x ${item.name} - R$ ${item.price.toFixed(2)}</li> <br/> <li>${item.observation}</li>`).join('')}
          </ul>
          <p><strong>Observação:</strong> ${order.observation}</p>
        </div>
        <script>window.print();</script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [previousOrdersCount, setPreviousOrdersCount] = useState(0);

  useEffect(() => {
    audioRef.current = new Audio('/notification.wav');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const stopListening = listenToOrders((updatedOrders) => {
      updatedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Toca o som quando um novo pedido é adicionado
      if (updatedOrders.length > previousOrdersCount) {
        const newPendingOrders = updatedOrders.filter(order => 
          order.status === 'Pendente' && 
          !orders.some(o => o.orderId === order.orderId)
        );
        
        if (newPendingOrders.length > 0 && audioRef.current) {
          audioRef.current.play().catch(e => console.error("Falha ao reproduzir áudio:", e));
        }
      }
      
      setPreviousOrdersCount(updatedOrders.length);
      setOrders(updatedOrders);
    });

    return () => stopListening();
  }, [orders, previousOrdersCount]);

  const updateStatus = async (orderId: string, newStatus: Order['status']) => {
    await updateOrderStatus(orderId, newStatus);
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestão de Pedidos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {orders.map((order) => (
          <Card key={order.orderId} className={`${getCardColor(order.status)} transition-colors duration-200 flex flex-col h-full`}>
            <CardHeader>
              <CardTitle className='flex justify-between'>
                Pedido #{order.orderId}
                <Button className="flex items-center" onClick={() => printOrder(order)}>
                  <Printer size={16} />
                </Button>
              </CardTitle>
              <p className="text-sm text-gray-500">Criado há: {getElapsedTime(order.createdAt)}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                <p>Cliente: {order.name}</p>
                <p>Email: {order.email}</p>
                <p>Endereço: {order.address}</p>
                <p>Total: R$ {order.totalValue.toFixed(2)}</p>
                <p>Forma de Pagamento: {order.paymentMethod}</p>
                <p>Troco: para {order.troco}</p>
                <p>Itens:</p>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>{item.quantity}x {item.name} - R$ {item.price.toFixed(2)} <br /> Observações: {item.observation}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <div className="p-4 flex items-center space-x-2 border-t mt-auto">
              {order.status === 'Pendente' && (
                <>
                  <Button onClick={() => {
                    updateStatus(order.orderId, 'Preparo')
                    printOrder(order)
                  }} className="bg-green-500 hover:bg-green-600 text-white">
                    <CheckCircle size={16} className="mr-2" /> Aceitar
                  </Button>
                  <Button onClick={() => updateStatus(order.orderId, 'Cancelado')} className="bg-red-500 hover:bg-red-600 text-white">
                    <XCircle size={16} className="mr-2" /> Negar
                  </Button>
                </>
              )}
              {order.status === 'Preparo' && (
                <Button onClick={() => updateStatus(order.orderId, 'Entrega')} className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Truck size={16} className="mr-2" /> Despachar
                </Button>
              )}
              {order.status === 'Entrega' && (
                <Button onClick={() => updateStatus(order.orderId, 'Entregue')} className="bg-green-500 hover:bg-green-600 text-white">
                  <PackageCheck size={16} className="mr-2" /> Entregue
                </Button>
              )}
              {(order.status === 'Preparo' || order.status === 'Entrega') && (
                <Button onClick={() => updateStatus(order.orderId, 'Cancelado')} className="bg-red-500 hover:bg-red-600 text-white">
                  <XCircle size={16} className="mr-2" /> Cancelar
                </Button>
              )}
              <Button 
                onClick={() => {
                  const contactUser = 'https://wa.me/' + order.contactNumber;
                  window.open(contactUser, '_blank');
                }} 
                className="bg-gray-500 hover:bg-gray-600 text-white">
                <Phone size={16} className="mr-2" /> Contato
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}