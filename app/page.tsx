'use client';

// Componentes e bibliotecas externas
import Banner from "@/components/Banner";
import Section from "@/components/Section";
import StoreProfile from "@/components/StoreProfile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LucideShoppingCart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CartProductCard from "@/components/CartProductCard";
import { useCart } from "./context/CartContext";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUser, User } from "@/services/userService";
import { useStoreConfig } from "./context/StoreContext";

export default function Home() {
  const { cart, addToCart, removeFromCart } = useCart();
  const session = useSession();
  const [user, setUser] = useState<User | null>(null);
  const storeConfig = useStoreConfig();

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.data?.user) {
        const userData = await getUser(session.data.user.email || '');
        setUser(userData as User);
      }
    };

    fetchUser();
  }, [session]);

  useEffect(() => {
    if (user && user.address === "") {
      redirect("/login");
    }
  }, [user]);

  return (
    <div className="flex flex-col gap-4 pb-14">
      <Banner />
      <StoreProfile />
      <Section />

      <Popover>
        <PopoverTrigger asChild>
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: [1, 1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="fixed bottom-1/2 right-8"
          >
            <Button
              className={`w-14 h-14 rounded-full transition-all transform ease-in-out ${
                cart.length > 0 ? "bg-red-950/30" : "bg-black/30"
              } backdrop-blur-md border ${
                cart.length > 0 ? "border-white border-2" : "border-white/30"
              } shadow-lg text-white flex items-center justify-center hover:bg-black/50 p-4 cursor-pointer fixed top-24 right-3`}
            >
              <ShoppingCart className="w-6 h-6" />
            </Button>
          </motion.div>
        </PopoverTrigger>

        <PopoverContent
          className={`mx-4 bg-black/50 backdrop-blur-md border shadow-lg text-white fixed -top-40 -right-8 w-[23rem] h-96
          sm:min-w-[35rem] sm:min-h-[35rem] sm:fixed sm:-top-80 sm:right-10 flex flex-col overflow-x-hidden`}
        >
          <h1 className="font-bold text-xl flex gap-2 items-center">Carrinho</h1>

          <div className="flex flex-col">
            {cart.length > 0 ? (
              cart.map((product) => (
                <CartProductCard
                  key={product.id}
                  {...product}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                />
              ))
            ) : (
              <div className="flex items-center justify-center gap-2 h-40">
                <LucideShoppingCart />
                <p>Carrinho vazio</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-col mt-auto">
            <div className="w-[95%] h-[1px] bg-white/30 m-auto" />

            <p className="text-sm">
              Subtotal: R$
              {cart.reduce((acc, product) => acc + product.price * product.quantity, 0).toFixed(2)}
            </p>

            <p className="text-sm">Entrega: R$10,00</p>

            <p className="text-sm font-bold">
              Total: R$
              {(cart.reduce((acc, product) => acc + product.price * product.quantity, 0) + 10).toFixed(2)}
            </p>

            <div className="flex gap-2 items-center">
              <Button
                onClick={() => redirect('/cart/checkout')}
                className="w-full h-10 rounded-md bg-black/30 backdrop-blur-md border border-white/50 text-white shadow-lg flex items-center justify-center hover:bg-black/60 p-4 cursor-pointer"
                disabled={!storeConfig.storeConfig.isDeliveryActive}
              >
                {
                  storeConfig.storeConfig.isDeliveryActive ? 'Finalizar compra' : 'Loja fechada.' + storeConfig.storeConfig.workingHours
                }
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}