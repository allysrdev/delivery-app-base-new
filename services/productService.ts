import { ref, set, get, getDatabase, query, orderByChild, startAt, endAt, remove} from 'firebase/database';
import { database } from './firebase';


// Função para adicionar um novo produto
export const addProduct = (productId: string, name: string, description: string, price: number, imageUrl: string, discount?: number): void => {
  set(ref(database, 'products' + productId), {
    name: name,
    description: description,
    price: price,
    discount: discount ? discount : 0,
    imagemUrl: imageUrl,
  });
};

// Função para obter todos os produtos
export const getProducts = async () => {
  const db = getDatabase();
  const productsRef = ref(db, "products");

  try {
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map((key) => ({
        id: key, // Pega o ID do Firebase
        ...data[key], // Pega os outros dados do produto
      }));
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
};


export const getProductsBySearch = async (searchTerm: string) => {

  try {
      // Crie uma referência para o nó '/products'
      const productsRef = ref(database, "/products");

      // Para uma busca simples por nome, supondo que cada produto tenha o campo "name".
      // Atenção: o Firebase Realtime Database suporta queries simples. Se precisar de busca por parte do texto, avalie a estratégia.
      const productsQuery = query(
        productsRef,
        orderByChild('name'),
        startAt(searchTerm),
        endAt(searchTerm + "\uf8ff")
      );

      const snapshot = await get(productsQuery);
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Converta o objeto retornado em um array
        const productsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        return(productsArray);
      } else {
        return([]);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
    }
};

export const updateProduct = async (productId: string, name: string, description: string, price: number, imageUrl: string, discount?: number, category?: string): Promise<void> => {
  try {
    await set(ref(database, `products/${productId}`), {
      name: name,
      description: description,
      price: price,
      imageUrl: imageUrl,
      discount: discount ? discount : 0,
      category: category ? category : "",
    });
    console.log("Produto atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar o produto:", error);
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const productRef = ref(database, `products/${productId}`);
    await remove(productRef);  // Remove o produto com o ID fornecido
  } catch (error) {
    console.error("Erro ao excluir o produto:", error);
    throw new Error("Não foi possível excluir o produto.");
  }
};

