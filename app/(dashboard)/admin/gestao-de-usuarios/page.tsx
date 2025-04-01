"use client"; // Necessário para usar hooks e interatividade

import { useEffect, useState } from "react";
import { User, getAllUsers, getUser, updateUser } from "@/services/userService"; // Importe a função updateUser
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner"; // Para exibir notificações
import { Loader } from "lucide-react";

export default function GestaoUsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true)

  // Busca usuários ao carregar a página ou ao pesquisar
  useEffect(() => {
    const fetchUsers = async () => {
      if (searchEmail) {
        const user = await getUser(searchEmail);
        if (user) {
          setUsers([user]);
        } else {
          setUsers([]);
        }
        setLoading(false);
      } else {
        const allUsers = await getAllUsers();
        setUsers(allUsers || []);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchEmail]);

  // Abre o modal de edição
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  // Fecha o modal de edição
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  // Salva as alterações do usuário
  const handleSaveChanges = async () => {
    if (selectedUser) {
      try {
        await updateUser(selectedUser); // Atualiza o usuário no Firebase
        toast.success("Usuário atualizado com sucesso!"); // Notificação de sucesso

        // Atualiza a lista de usuários
        const updatedUsers = users.map((user) =>
          user.userId === selectedUser.userId ? selectedUser : user
        );
        setUsers(updatedUsers);

        handleCloseDialog(); // Fecha o modal
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        toast.error("Erro ao atualizar usuário. Tente novamente."); // Notificação de erro
      }
    }
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-6">Gestão de Usuários</h1>

      {/* Barra de pesquisa */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Pesquisar por e-mail"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="bg-black text-white border-gray-700 max-w-64"
          
        />
      </div>

      {/* Tabela de usuários */}
      <div className="overflow-x-hidden w-full">
        {
          loading ? (
            <div className="flex items-center gap-2 justify-center h-full overflow-hidden">
              <p>Aguarde</p>
              <span className="animate-spin text-6xl text-gray-300"><Loader /></span>
            </div>
          ) : (
              <Table className="bg-black rounded-lg w-full min-w-full">
          <TableHeader className="min-w-full">
            <TableRow>
              <TableHead className="text-white">Nome</TableHead>
              <TableHead className="text-white">E-mail</TableHead>
              <TableHead className="text-white hidden md:table-cell">Endereço</TableHead>
              <TableHead className="text-white hidden md:table-cell">Telefone</TableHead>
              <TableHead className="text-white">Permissões</TableHead>
              <TableHead className="text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.userId} className="hover:bg-gray-800 transition-colors">
                  <TableCell className="text-white">{user.name}</TableCell>
                  <TableCell className="text-white">{user.email}</TableCell>
                  <TableCell className="text-white hidden md:table-cell">{user.address}</TableCell>
                  <TableCell className="text-white hidden md:table-cell">{user.telephone}</TableCell>
                  <TableCell className="text-white">
                    {user.role === "Administrador" ? "Administrador" : "Usuário"}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleEditUser(user)}
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-white">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
          )
        }
      </div>

      {/* Modal de edição */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-gray-900 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Nome"
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
                className="bg-gray-800 text-white border-gray-700"
              />
              <Input
                type="email"
                placeholder="E-mail"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                className="bg-gray-800 text-white border-gray-700"
              />
              <Input
                type="text"
                placeholder="Endereço"
                value={selectedUser.address}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, address: e.target.value })
                }
                className="bg-gray-800 text-white border-gray-700"
              />
              <Input
                type="text"
                placeholder="Telefone"
                value={selectedUser.telephone}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, telephone: e.target.value })
                }
                className="bg-gray-800 text-white border-gray-700"
              />
              <Input
                type="text"
                placeholder="Permissão"
                value={selectedUser.role}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, role: e.target.value })
                }
                className="bg-gray-800 text-white border-gray-700"
              />
              <Button
                onClick={handleSaveChanges}
                className="bg-white text-black hover:bg-gray-200"
              >
                Salvar Alterações
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}