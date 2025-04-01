import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { LucideMinus, LucidePlus, LucideTextSelect } from 'lucide-react'
import { Product } from './ProductCard'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { useCart } from '@/app/context/CartContext'

function CartProductCard({ id, name, price, imageUrl, quantity, addToCart, removeFromCart }: Product) {
  const [observation, setObservation] = React.useState("");
  const { cart } = useCart();
  
  return (
    <div className="w-full  p-2 h-24 border-b-2 border-white/20 flex items-center justify-between gap-2">
      <div className='flex items-start gap-2'>
      <Image
              src={imageUrl || ''}
              alt="Product"
              width={65}
              height={65}
              className="rounded-md object-cover"
            />
            <div>
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs font-light">R${price}</p>
              <Popover>
              <PopoverTrigger className='text-xs'>Adicionar observação</PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-2">
                <Label className="flex gap-2 items-start text-xs">
                    <LucideTextSelect size={15} /> Observações
                  </Label>
                  <div className="flex gap-2">
                    <Textarea
                      name="observation"
                      placeholder="Ex: Sem verduras, maionese à parte [...]"
                      className="w-full h-32 resize-y align-top text-xs"
                      value={observation}
                    onChange={(e) => {
                      setObservation(e.target.value)
                      const item = cart.find((item) => item.id === id);
                      if (item) {
                        item.observation = observation;
                      }
                      console.log(cart)
                    }}
                    />
                </div>
                
                </div>
              </PopoverContent>
            </Popover>
          
      </div>
      </div>     
      <div className="flex gap-2 items-center">
            <Button onClick={() => removeFromCart?.(id)} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/50 shadow-lg text-white  flex items-center justify-center hover:bg-black/50 p-1 cursor-pointer">
              <LucideMinus size={18} />
            </Button>
        <p>{quantity}</p>
        <Button onClick={() => {
                addToCart?.({ name, price, imageUrl, id, quantity })
              }} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/50 shadow-lg text-white  flex items-center justify-center hover:bg-black/50 p-1 cursor-pointer">
              <LucidePlus size={18} />
        </Button>
        </div>
          </div>
  )
}

export default CartProductCard