"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { database } from '@/services/firebase';

interface StoreConfig {
  name: string;
  address: string;
  phone: string;
  image: string;
  workingHours: string;
  description: string;
  isDeliveryActive: boolean;
  banner: string;
}

interface StoreContextType {
  storeConfig: StoreConfig;
  updateStoreConfig: (config: Partial<StoreConfig>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storeConfig, setStoreConfig] = useState<StoreConfig>({
    name: 'Borchelle Fast Food',
    address: 'Rua do Borcelle, 123, FastFood',
    phone: '(11) 9 8888 7777',
    image: '/logo.png',
    workingHours: 'Terça a Domingo: 18:00 - 23:00',
    description: 'O melhor fast food da cidade!',
    isDeliveryActive: false, 
    banner: '/banner.png',
  });

  const isStoreOpen = (): boolean => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const isDayValid = dayOfWeek >= 2 || dayOfWeek === 0; 
    const isTimeValid =
      (currentHour > 18 || (currentHour === 18 && currentMinute >= 0)) &&
      (currentHour < 23 || (currentHour === 23 && currentMinute === 0));

    return isDayValid && isTimeValid;
  };

  useEffect(() => {
    const fetchStoreConfig = async () => {
      const configRef = ref(database, 'storeConfig');
      const snapshot = await get(configRef);
      if (snapshot.exists()) {
        const config = snapshot.val();
        setStoreConfig({
          ...config,
          isDeliveryActive: isStoreOpen(),
        });
      }
    };

    fetchStoreConfig();

    // Atualiza o status do delivery a cada minuto
    const interval = setInterval(() => {
      setStoreConfig((prevConfig) => ({
        ...prevConfig,
        isDeliveryActive: isStoreOpen(),
      }));
    }, 60000); // Verifica a cada minuto

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, []);

  const updateStoreConfig = async (config: Partial<StoreConfig>) => {
    const newConfig = { ...storeConfig, ...config };
    setStoreConfig(newConfig);
    await set(ref(database, 'storeConfig'), newConfig);
  };

  return (
    <StoreContext.Provider value={{ storeConfig, updateStoreConfig }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreConfig = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStoreConfig must be used within a StoreProvider');
  }
  return context;
};