import { ref, set, get, update } from 'firebase/database';
import { database } from './firebase'; // Importe a instância já inicializada

export interface User {
  name: string;
  userId: string;
  email: string;
  address: string;
  telephone: string;
  profileImage: string;
  role: string;
  password?: string;
}

export const addUser = async ({ userId, name, email, address, telephone, profileImage , password}: User): Promise<void> => {
  const userRef = ref(database, `users/${userId}`);

  try {
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      throw new Error('Usuário já existe!');
    }

    await set(userRef, {
      email,
      name,
      address,
      telephone: "55" + telephone,
      profileImage,
      created_at: new Date().toISOString(),
      role: 'Usuário',
      password
    });

    console.log('Usuário cadastrado com sucesso!');
  } catch (error) {
    console.error('Erro no cadastro:', error);
    throw new Error(`Falha ao criar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

export const getUser = async (email: string): Promise<User | null> => {
  const usersRef = ref(database, 'users');

  try {
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      console.log('Nenhum usuário encontrado!');
      return null;
    }

    // Percorre os usuários e encontra o que tem o e-mail correspondente
    let userData: User | null = null;
    snapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val();
      if (user.email === email) {
        userData = { userId: childSnapshot.key, ...user };
      }
    });

    if (!userData) {
      console.log('Usuário não encontrado!');
    }

    return userData;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null; // Retorno explícito para evitar `undefined`
  }
};

export const updateUser = async ({ userId, name, email, address, telephone, profileImage, role }: User): Promise<void> => {
  const userRef = ref(database, `users/${userId}`);

  try {
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      throw new Error('Usuário não encontrado!');
    }

    await update(userRef, {
      ...(name && { name }),
      ...(email && { email }),
      ...(address && { address }),
      ...(telephone && { telephone }),
      ...(profileImage && { profileImage }),
      ...(role && { role }),
      updated_at: new Date().toISOString(),
    });

    console.log('Usuário atualizado com sucesso!');
  } catch (error) {
    console.error('Erro na atualização:', error);
    throw new Error(`Falha ao atualizar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

export const getAllUsers = async (): Promise<User[] | null> => {
  const usersRef = ref(database, 'users'); // Referência para o nó 'users'

  try {
    const snapshot = await get(usersRef); // Busca os dados do nó 'users'

    if (!snapshot.exists()) {
      console.log('Nenhum usuário encontrado!');
      return null;
    }

    // Converte o snapshot em uma lista de usuários
    const users: User[] = [];
    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val(); // Dados do usuário
      users.push({
        userId: childSnapshot.key, // ID do usuário (chave do nó)
        ...userData, // Demais campos do usuário
      });
    });

    return users;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw new Error(`Falha ao buscar usuários: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};