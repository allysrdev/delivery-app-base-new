'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic' // 🔥 Importa dinamicamente para evitar SSR
import { ApexOptions } from 'apexcharts'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Order } from '@/services/orderService'

// Importa o gráfico dinamicamente, desativando o SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface OrderStatusPieProps {
  orders: Order[];
}

const statusColors = {
  'Pendente': '#F59E0B',
  'Preparo': '#3B82F6',
  'Entrega': '#8B5CF6',
  'Entregue': '#10B981',
  'Cancelado': '#EF4444'
}

export default function OrderStatusPie({ orders }: OrderStatusPieProps) {
  const statusData = useMemo(() => {
    const statusCount = orders.reduce((acc: Record<string, number>, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {})

    return {
      labels: Object.keys(statusCount),
      series: Object.values(statusCount)
    }
  }, [orders])

  const options: ApexOptions = {
    labels: statusData.labels,
    colors: statusData.labels.map(label => statusColors[label as keyof typeof statusColors]),
    legend: {
      position: 'bottom',
      labels: {
        colors: '#6B7280'
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#1F2937']
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status dos Pedidos</CardTitle>
      </CardHeader>
      <CardContent>
        <Chart
          options={options}
          series={statusData.series}
          type="donut"
          height={300}
        />
      </CardContent>
    </Card>
  )
}
