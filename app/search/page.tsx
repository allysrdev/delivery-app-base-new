"use client"
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { LucideSearch } from 'lucide-react'
import ProductCard, { Product } from '@/components/ProductCard'
import { getProductsBySearch } from '@/services/productService'
import { useCart } from '../context/CartContext'
 
const formSchema = z.object({
  search: z.string()
})

function Page() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const { cart, addToCart, removeFromCart } = useCart()

useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300); // Ajuste o tempo conforme necessário

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    async function getProductsBySearchterm(debouncedTerm: string) {
      const products = await getProductsBySearch(debouncedTerm);
      setProducts(products || []);
    }


    if (debouncedTerm) {
      getProductsBySearchterm(debouncedTerm)
    }
  }, [debouncedTerm]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  })
 
async function onSubmit() {
  try {
    const result = await getProductsBySearch(searchTerm);
    setProducts(result || []);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    setProducts([]);
  }
}





  return (
      <div className='w-full h-[100vh] flex flex-col items-center gap-12 pt-3'>
         <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pesquisar</FormLabel>
              <FormControl>
                <Input  className='text-xs' placeholder="Digite o nome do produto que deseja encontrar." {...field} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
      </form>
          </Form>
          <div className='w-full h-full flex flex-col'>
        <h1 className='text-xl font-bold'>Resultados da busca</h1>
        <div className='w-full h-1/2 mt-20 flex gap-4 items-center justify-center'>
          {
            products.length === 0? (
              <div className='w-full gap-2 flex flex-col  items-center justify-center'>
                <LucideSearch className='m-auto' />
                <h2 className='text-sm'>Digite algo para pesquisar.</h2>
              </div>
            ) : (
                <div className='w-full max-h-96 gap-2 flex flex-col sm:flex-row'>
                
                  {products.map((product: React.JSX.IntrinsicAttributes & Product) => {
                      const cartItem = cart.find((item) => item.id === product.id);
                      const quantity = cartItem ? cartItem.quantity : 0;

                      return (
                        <ProductCard
                          key={product.id}
                          {...product}
                          quantity={quantity} 
                          addToCart={addToCart}
                          removeFromCart={removeFromCart}
                        />
                      );
                    })}

                  </div>
            )
          }
                  
              </div>
          </div>
    </div>
  )
}

export default Page