import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* Container principal */}
      <div className="flex-1 p-4">
        <div className="w-full sm:min-w-6xl space-y-10">
          <h1 className="text-5xl font-bold text-center text-white">Bem-vindo(a) ao Dashboard</h1>
          <p className="text-lg text-center text-gray-300">
            Gerencie sua loja de forma eficiente e intuitiva.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card: Gestão de Pedidos */}
            <Link href="/admin/gestao-de-pedidos">
              <Card className="h-full bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white">Gestão de Pedidos</CardTitle>
                  <CardDescription className="text-gray-400">
                    Acompanhe e gerencie os pedidos da loja.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-white text-black hover:bg-gray-200">
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Card: Financeiro */}
            <Link href="/admin/financeiro">
              <Card className="h-full bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white">Financeiro</CardTitle>
                  <CardDescription className="text-gray-400">
                    Controle as finanças e relatórios.
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button className="w-full bg-white text-black hover:bg-gray-200">
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Card: Configurações da Loja */}
            <Link href="/admin/configuracoes-da-loja">
              <Card className="h-full bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white">Configurações da Loja</CardTitle>
                  <CardDescription className="text-gray-400">
                    Personalize as configurações da sua loja.
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button className="w-full bg-white text-black hover:bg-gray-200">
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Card: Gestão de Produtos */}
            <Link href="/admin/addproduct">
              <Card className="h-full bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white">Gestão de Produtos</CardTitle>
                  <CardDescription className="text-gray-400">
                    Adicione, edite ou remova produtos.
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button className="w-full bg-white text-black hover:bg-gray-200">
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Card: Gestão de Usuários */}
            <Link href="/admin/gestao-de-usuarios">
              <Card className="h-full bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white">Gestão de Usuários</CardTitle>
                  <CardDescription className="text-gray-400">
                    Gerencie os usuários e permissões.
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button className="w-full bg-white text-black hover:bg-gray-200">
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Card: Voltar para Loja */}
            <Link href="/">
              <Card className="h-full bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white">Voltar para Loja</CardTitle>
                  <CardDescription className="text-gray-400">
                    Retorne à página inicial da loja.
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button className="w-full bg-white text-black hover:bg-gray-200" variant="outline">
                    Voltar
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
