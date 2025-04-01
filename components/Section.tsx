"use client"
import React, { useEffect, useState } from 'react'
import ProductCard, { Product } from './ProductCard'
import { getProducts } from '@/services/productService';
import { useCart } from '@/app/context/CartContext';
import { Skeleton } from './ui/skeleton';
import Box from './ui/box';

function Section() {
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);
  const { addToCart, removeFromCart, cart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        const categorizedProducts = data.reduce((acc: Record<string, Product[]>, product: Product) => {
          const category = product.category || 'Outros';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        }, {});
        setProductsByCategory(categorizedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
          <div className="mt-8 flex flex-col gap-4">
            <h1 className="font-bold text-xl">Carregando</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Box>
              <div className="flex sm:flex-col sm:space-y-3 space-x-3">
              <Skeleton className="h-[125px] min-w-[130px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 sm:w-[250px] w-[150px]" />
                <Skeleton className="h-3 sm:w-[200px] w-[50px]" />
                <Skeleton className="h-3 sm:w-[200px] w-[50px]" />
                <Skeleton className="h-4 sm:w-[40px] w-[20px]" />
                </div>
              </div>
            </Box>
            </div>
          </div>
      ) : (
        Object.keys(productsByCategory).map((category) => (
          <div key={category} className="mt-8 flex flex-col gap-4">
            <h1 className="font-bold text-xl">{category}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productsByCategory[category].map((product) => {
                const cartItem = cart.find((item) => item.id === product.id);
                const quantity = cartItem ? cartItem.quantity : 0;

                return (
                  <ProductCard
                    key={product.id}
                    {...product}
                    quantity={quantity}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                    discount={product.discount}
                  />
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Section;
