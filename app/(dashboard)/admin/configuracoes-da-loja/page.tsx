"use client";
import { useStoreConfig } from '@/app/context/StoreContext';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import StoreProfile from '@/components/StoreProfile';
import Image from 'next/image';



const Configuracoes: React.FC = () => {
  const { storeConfig, updateStoreConfig } = useStoreConfig();
  const [formData, setFormData] = useState({
    name: storeConfig.name,
    address: storeConfig.address,
    phone: storeConfig.phone,
    image: storeConfig.image,
    workingHours: storeConfig.workingHours,
    description: storeConfig.description,
    isDeliveryActive: storeConfig.isDeliveryActive,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreConfig(formData);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Configurações da Loja</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome da Loja:</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="address">Endereço:</Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Telefone:</Label>
            <Input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="image">Imagem da Loja:</Label>
            <Input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="workingHours">Horário de Funcionamento:</Label>
            <Input
              type="text"
              id="workingHours"
              name="workingHours"
              value={formData.workingHours}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descrição:</Label>
            <Input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDeliveryActive"
              name="isDeliveryActive"
              checked={formData.isDeliveryActive}
              onCheckedChange={(checked: boolean) =>
                setFormData((prevData) => ({
                  ...prevData,
                  isDeliveryActive: checked as boolean,
                }))
              }
            />
            <Label htmlFor="isDeliveryActive">Delivery Ativo</Label>
          </div>
          <Button type="submit">Salvar Configurações</Button>
        </form>

        <div className="bg-black/30 backdrop-blur-md rounded-md p-4 gap-4 flex flex-col sm:min-w-lg items-center justify-center">
          <StoreProfile />
          <Image
            src="/poweredby.png"
            alt="powered by guaiamum digital"
            width={200}
            height={100}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;