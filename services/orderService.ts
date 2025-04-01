import { ref, set, get, getDatabase, push, onValue, off, DataSnapshot } from 'firebase/database';
import { database } from './firebase';

// Interface para um item do pedido
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  observation?:string
}

// Interface para um pedido
export interface Order {
  orderId: string;
  createdAt: string;
  userId: string;
  contactNumber: string;
  name: string;
  email: string;
  address: string;
  items: OrderItem[];
  totalValue: number;
  status: 'Pendente' | 'Preparo' | 'Entrega' | 'Entregue' | 'Cancelado';
  paymentMethod: string;
  troco?: string;
}

// Função para gerar um número de pedido aleatório
const generateOrderId = (): string => {
  return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
};

// Função para criar um novo pedido
export const createOrder = async (
  userId: string,
  contactNumber: string,
  name: string,
  email: string,
  address: string,
  items: OrderItem[],
  totalValue: number,
  paymentMethod?: string,
  status?: 'Cancelado'| 'Pendente' | 'Preparo' | 'Entrega' | 'Entregue',
  troco?: string,
): Promise<string | null> => {
  try {
    const db = getDatabase();
    const ordersRef = ref(db, 'orders');

    const newOrder: Order = {
      orderId: generateOrderId(),
      createdAt: new Date().toISOString(),
      userId,
      contactNumber,
      name,
      email,
      address,
      items,
      totalValue,
      status: status ? status : 'Pendente',
      paymentMethod: paymentMethod ? paymentMethod : 'Pagamento Online',
      troco: troco ? troco : 'Não necessário',

    };

    const newOrderRef = push(ordersRef);
    await set(newOrderRef, newOrder);

    return newOrder.orderId;
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return null;
  }
};

// Função para obter todos os pedidos
export const getOrders = async (): Promise<Order[]> => {
  try {
    const db = getDatabase();
    const ordersRef = ref(db, 'orders');

    const snapshot = await get(ordersRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map((key) => ({
        ...data[key],
      }));
    }
    return [];
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return [];
  }
};

export const getOrdersByUser = async (email: string): Promise<Order[]> => {
    try {
        const ordersRef = ref(database, 'orders'); // Usa o `database` corretamente
        const snapshot = await get(ordersRef);
    
        if (snapshot.exists()) {
            const data = snapshot.val();
            return Object.keys(data)
                .map((key) => data[key])
                .filter((order) => order.email === email);
        }
        return [];
    } catch (error) {
        console.error('Erro ao buscar pedidos do usuário:', error);
        return [];
    }
}
  
export const updateOrderStatus = async (orderId: string, newStatus: Order['status']): Promise<void> => {
  try {
    const db = getDatabase();
    const ordersRef = ref(db, 'orders');

    const snapshot = await get(ordersRef);
    if (snapshot.exists()) {
      const data = snapshot.val();

      // Encontra o pedido pelo orderId
      const orderKey = Object.keys(data).find((key) => data[key].orderId === orderId);

      if (orderKey) {
        const orderRef = ref(db, `orders/${orderKey}`);
        const order = data[orderKey];
        order.status = newStatus;
        await set(orderRef, order); // Atualiza o pedido no banco de dados
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
  }
};

export const listenToOrdersByUser = (userEmail: string, callback: (orders: Order[]) => void) => {
  const db = getDatabase();
  const ordersRef = ref(db, 'orders');

  // Função que será chamada quando houver mudanças
  const handleDataChange = (snapshot: DataSnapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const orders = Object.keys(data)
        .map((key) => data[key])
        .filter((order) => order.email === userEmail); // Filtra pedidos pelo email do usuário
      callback(orders);
    } else {
      callback([]);
    }
  };

  // Começa a escutar mudanças
  onValue(ordersRef, handleDataChange);

  // Retorna uma função para parar de escutar mudanças
  return () => {
    off(ordersRef, 'value', handleDataChange);
  };
};

export const listenToOrders = (callback: (orders: Order[]) => void) => {
  const db = getDatabase();
  const ordersRef = ref(db, 'orders');

  // Função que será chamada quando houver mudanças
  const handleDataChange = (snapshot: DataSnapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const orders = Object.keys(data).map((key) => data[key]);
      callback(orders); // Atualiza a lista de pedidos
    } else {
      callback([]); // Caso não haja pedidos, passamos um array vazio
    }
  };

  // Começa a escutar mudanças
  onValue(ordersRef, handleDataChange);

  // Retorna uma função para parar de escutar mudanças
  return () => {
    off(ordersRef, 'value', handleDataChange);
  };
};
