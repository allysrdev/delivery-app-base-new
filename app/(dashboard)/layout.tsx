import { auth } from "@/auth"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { getUser } from "@/services/userService"
import { redirect } from "next/navigation"

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    const user = await getUser(session?.user?.email || '')
    const isUserAdmin = user?.role === 'Administrador'


    if (!isUserAdmin) {
        redirect('/')
     }

  
    return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <main className="overflow-x-hidden">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
