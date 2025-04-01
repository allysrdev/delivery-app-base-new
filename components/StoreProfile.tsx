import { useStoreConfig } from '@/app/context/StoreContext';
import Image from 'next/image';
import React from 'react';
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

function StoreProfile() {
  const { storeConfig } = useStoreConfig();

  return (
    <div className="bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md p-2">
      <div className="flex gap-2 items-center">
        <Image
          src={storeConfig.image || '/logo.png'} // Fallback para imagem padrão
          width={50}
          height={50}
          alt="logo"
          className="rounded-full object-cover border-[2.5px] border-[#ededed]"
        />
        <div className="flex flex-col items-start">
          <h1 className="font-bold">{storeConfig.name}</h1>
          <p className="text-xs font-bold">{storeConfig.address}</p>
          <p className="text-xs font-bold">{storeConfig.phone}</p>
          <AlertDialog>
          <AlertDialogTrigger className='text-sm underline'>Ver mais</AlertDialogTrigger>
          <AlertDialogContent className='bg-black'>
            <AlertDialogHeader>
                <AlertDialogTitle>
                  {storeConfig.description}
                  
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {storeConfig.address}
                </AlertDialogDescription>
                <AlertDialogDescription>
                  {storeConfig.phone}
                </AlertDialogDescription>
                <AlertDialogDescription>
                  {storeConfig.workingHours}
                </AlertDialogDescription>
                <AlertDialogDescription>
                  {
                    storeConfig.isDeliveryActive? (
                      <span className="text-green-500">Loja Aberta</span>
                    ) : (
                      <span className="text-red-500">Loja Fechada</span>
                    )
                  }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className='bg-black/30'>Ok</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export default StoreProfile;