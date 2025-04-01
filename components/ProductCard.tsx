'use client'

import { LucideMinus, LucidePlus } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { CartItem } from '@/app/context/CartContext';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  quantity: number;
  category?: string;
  discount?: number;
  addToCart?: (item: CartItem) => void;
  removeFromCart?: (id: string) => void;
}


export default function ProductCard({ id, name, price, quantity, description, imageUrl, addToCart, removeFromCart, discount }: Product) {
  return (
    <div className="bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md p-4 flex sm:flex-col items-start sm:items-center sm:max-w-sm w-full sm:h-96 h-56 gap-4">
      <div className="flex-shrink-0 h-28">
        <Image
          src={imageUrl ? imageUrl : "/"}
          alt={name}
          width={120}
          height={120}
          className="rounded-md object-cover"
        />
      </div>
      <div className="flex flex-col justify-between ml-4 flex-grow h-full w-full items-start sm:items-start sm:gap-4">
        <h2 className="text-white text-lg font-semibold">{name}</h2>
              <AlertDialog>
        <AlertDialogTrigger className='underline'>Ver mais</AlertDialogTrigger>
        <AlertDialogContent className='bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md'>
          <AlertDialogHeader>
              <AlertDialogTitle className='mr-auto'>Detalhes do produto</AlertDialogTitle>
              <AlertDialogDescription className='flex flex-col h-[50vh] items-center justify-center'>
                <div className='flex flex-col w-full items-center gap-10'>
                  <div className="flex-shrink-0 h-28 w-full items-center flex justify-center">
                    <Image
                      src={imageUrl ? imageUrl : "/"}
                      alt={name}
                      width={150}
                      height={150}
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg text-white font-medium">{name}</h1>
                      {discount && discount > 0 ? (
                        <div className='flex gap-2'>
                          <h2 className="text-red-400 text-lg font-semibold line-through">R${price},00</h2>
                          <h2 className="text-green-400 text-lg font-semibold">
                            R${(price * (1 - discount / 100)).toFixed(2).replace('.', ',')}
                          </h2>
                        </div>
                      ): (
                          <h2 className="text-white text-lg font-semibold">R${price},00</h2>
                          
                      )}
                    <p className="text-sm text-white font-light">{description}</p>

                </div>
                </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
            <AlertDialogFooter>
              <div className='w-full flex items-end justify-end'>
                <AlertDialogCancel className='bg-black'>Fechar</AlertDialogCancel>
              </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        <p className="text-gray-300 text-sm line-clamp-3 overflow-hidden">
          {description}
        </p>
        {discount && discount > 0 ? (
          <div className='flex gap-2'>
            <h2 className="text-red-400 text-lg font-semibold line-through">R${price},00</h2>
            <h2 className="text-green-400 text-lg font-semibold">
              R${(price * (1 - discount / 100)).toFixed(2).replace('.', ',')}
            </h2>
          </div>
        ): (
            <h2 className="text-white text-lg font-semibold">R${price},00</h2>
            
        )}
        <div className="mt-auto flex items-center justify-center space-x-4">
          <div className="flex gap-2 items-center">
            <Button onClick={() => {
              removeFromCart?.(id)
            }} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/50 shadow-lg text-white  flex items-center justify-center hover:bg-black/50 p-1 cursor-pointer">
              <LucideMinus size={18} />
            </Button>
            <p>{quantity}</p>
            <Button
              onClick={() => {
                addToCart?.({ name, price: discount ? Number((price * (1 - discount / 100)).toFixed(2)) : price, imageUrl, id, quantity })
              }}
              className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/50 shadow-lg text-white  flex items-center justify-center hover:bg-black/50 p-1 cursor-pointer"
            >
              <LucidePlus size={18} />
            </Button>
        </div>
      </div>
    </div>
    </div>
  );
}