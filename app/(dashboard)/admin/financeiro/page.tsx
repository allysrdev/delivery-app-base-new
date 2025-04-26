"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseISO, isToday, isWithinInterval } from "date-fns";
import { getOrders, Order } from "@/services/orderService";
import SalesChart from "@/components/SalesChart";
import OrderStatusPie from "@/components/OrderStatusPie";
import ProductPerformance from "@/components/ProductPerformance";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas-pro";

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
          (title === 'Pedidos Hoje' ? value : `R$${value.toLocaleString()}`) 
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

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const chartsRef = useRef<HTMLDivElement>(null); // Referência para capturar os gráficos

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
      setFilteredOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    if (startDate && endDate) {
      filtered = filtered.filter(order => 
        isWithinInterval(parseISO(order.createdAt), {
          start: parseISO(startDate),
          end: parseISO(endDate),
        })
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [startDate, endDate, statusFilter, orders]);

  const todayOrders = filteredOrders.filter(order => 
    isToday(parseISO(order.createdAt)) && order.status !== 'Cancelado'
  );

  const averageTicket = filteredOrders.length > 0 
    ? filteredOrders.filter(order => order.status !== 'Cancelado')
        .reduce((acc, order) => acc + order.totalValue, 0) / filteredOrders.length
    : 0;

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatusFilter("");
  };

  const generatePDF = async () => {
  // 1. Instancia o documento
  const doc = new jsPDF();                                     

  // 2. Adiciona o título
  doc.text("Relatório de Pedidos", 14, 20);                     

  // 3. Gera a tabela de pedidos
  autoTable(doc, {                                              
    startY: 30,
    head: [['ID', 'Cliente', 'Data', 'Valor', 'Status']],
    body: filteredOrders.map(order => [
      order.orderId,
      order.name,
      new Date(order.createdAt).toLocaleDateString(),
      `R$ ${order.totalValue.toFixed(2)}`,
      order.status
    ]),
  });                                                           

  // 4. Se houver container de gráficos, captura como Imagem
  if (chartsRef.current) {
    const canvas = await html2canvas(chartsRef.current, { 
      backgroundColor: "#ffffff"                                 
    });                                                         

    // 5. Converte o Canvas em PNG Data URL
    const imgData = canvas.toDataURL('image/png');              

    // 6. Calcula dimensões para manter proporção
    const pdfWidth = doc.internal.pageSize.getWidth();          // largura da página :contentReference[oaicite:4]{index=4}
    const imgProps = doc.getImageProperties(imgData);           
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // 7. Insere nova página e adiciona a imagem
    doc.addPage();                                             
    doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);   
  }

  // 8. Salva o PDF
  doc.save("relatorio-pedidos.pdf");
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black w-full">
        <p className="text-white text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input 
          type="date" 
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-white text-black"
          placeholder="Data Início"
        />
        <Input 
          type="date" 
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-white text-black"
          placeholder="Data Fim"
        />
        <Select value={statusFilter} onValueChange={(value) => {setStatusFilter(value)}}>
        <SelectTrigger className="bg-white text-black w-full md:w-48">
          <SelectValue placeholder="Filtrar por Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Entregue">Entregue</SelectItem>
          <SelectItem value="Cancelado">Cancelado</SelectItem>
          <SelectItem value="Pendente">Pendente</SelectItem>
        </SelectContent>
      </Select>

        <Button onClick={clearFilters} className="bg-gray-500 hover:bg-gray-600 text-white">
          Limpar Filtros
        </Button>

        <Button onClick={generatePDF} className="bg-green-600 hover:bg-green-700 text-white">
          Gerar PDF
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard 
          title="Total Vendido"
          value={filteredOrders.filter(order => order.status !== 'Cancelado')
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
          value={`${(filteredOrders.filter(order => order.status === 'Entregue').length / (filteredOrders.length || 1) * 100).toFixed(1)}%`}
          description="Pedidos completos"
        />
      </div>

      {/* Gráficos */}
      <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <SalesChart orders={filteredOrders} />
        <ProductPerformance orders={filteredOrders} />
        <OrderStatusPie orders={filteredOrders} />
      </div>
    </div>
  );
}
