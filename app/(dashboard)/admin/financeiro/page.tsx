// app/dashboard/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { parseISO, isToday } from 'date-fns';
import { getOrders, Order } from "@/services/orderService";
import SalesChart from "@/components/SalesChart";
import OrderStatusPie from "@/components/OrderStatusPie";
import ProductPerformance from "@/components/ProductPerformance";

interface KPICardProps {
  title: string;
  value: number | string;
  description: string;
  trend?: number;
}

const KPICard = ({ title, value, description, trend }: KPICardProps) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {typeof value === 'number' ? 
          // Verifica se o valor é um número e se é monetário
          title === 'Pedidos Hoje' ? value : `R$${value.toLocaleString()}` 
          : value}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {description}
        {trend && (
          <span className={`ml-2 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </p>
    </CardContent>
  </Card>
);

export default async function Dashboard() {
  const orders: Order[] = await getOrders();

  // Filtra os pedidos do dia e ignora os cancelados
  const todayOrders = orders.filter(order => 
    isToday(parseISO(order.createdAt)) && order.status !== 'Cancelado'
  );
  
  // Calcula o ticket médio, ignorando pedidos cancelados
  const averageTicket = orders.length > 0 
    ? orders.filter(order => order.status !== 'Cancelado') // Exclui pedidos cancelados
        .reduce((acc, order) => acc + order.totalValue, 0) / orders.length
    : 0;

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard 
          title="Total Vendido"
          value={orders.filter(order => order.status !== 'Cancelado') // Exclui pedidos cancelados
            .reduce((acc, order) => acc + order.totalValue + 10, 0)}
          description="Incluindo taxas de entrega"
        />
        <KPICard
          title="Pedidos Hoje"
          value={todayOrders.length}
          description="Entregas realizadas"
        />
        <KPICard
          title="Ticket Médio"
          value={averageTicket}
          description="Valor médio por pedido"
        />
        <KPICard
          title="Taxa de Sucesso"
          value={`${(orders.filter(order => order.status === 'Entregue').length / orders.length * 100 || 0).toFixed(1)}%`}
          description="Pedidos completos"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <SalesChart orders={orders} />
        <ProductPerformance orders={orders} />
        <OrderStatusPie orders={orders} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      </div>
    </div>
  )
}
