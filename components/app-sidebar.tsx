"use client"
import { ArrowLeft, DollarSignIcon, Receipt, ScanBarcode, Settings, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Avatar from "./Avatar"
import { User } from "@/services/userService"

// Menu items.
const items = [
  
  {
    title: "Gestão de Pedidos",
    url: "/admin/gestao-de-pedidos",
    icon: Receipt,
  },
  {
    title: "Financeiro",
    url: "/admin/financeiro",
    icon: DollarSignIcon,
  },
  {
    title: "Configurações da Loja",
    url: "/admin/configuracoes-da-loja",
    icon: Settings,
    },
    {
    title: "Gestão de Produtos",
    url: "/admin/addproduct",
    icon: ScanBarcode,
  },
    {
    title: "Gestão de Usuários",
    url: "/admin/gestao-de-usuarios",
    icon: Users,
  },
  {
    title: "Voltar para Loja",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    icon: ArrowLeft,
  },
]

export function AppSidebar({user}: {user: User}) {
  return (
    <Sidebar className=" sm:text-gray-50">
      <SidebarContent className="bg-black/90">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-50">Dummy Lanches</SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-5">   
            <SidebarHeader>
                <div className='flex items-center flex-col sm:flex-row gap-4 justify-center'>
                <Avatar src={user.profileImage} width={50} height={50} alt='' />
                <div>
                <p className='text-start text-md'>Bem vindo(a), {user.name}!</p>
                </div>
            </div>
            </SidebarHeader>
            <SidebarMenu className="flex flex-col gap-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
