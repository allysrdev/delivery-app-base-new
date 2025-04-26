"use client"
import { LucideKey } from 'lucide-react'
import React, { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const formSchema = z.object({
  email: z.string().email({ message: "Insira um e-mail válido" }),
})
 

export default function ForgotPassword() {
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)


    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    })


    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        const res = await fetch('/api/forgot-password', {
            method: 'POST',
            body: JSON.stringify({
                email: values.email
            })
        })
        const data = await res.json()
        setMessage(data.message || data.error)
        setTimeout(() => {
            setMessage("Você pode fechar esta aba agora.")
            setLoading(false)
        }, 2000)

        
    }
  return (
    <div className='w-full h-[100vh] flex flex-col items-center overflow-hidden'>
      <div className='bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md p-6 w-full h-[85%] flex items-center justify-center flex-col gap-8'>
            <div className='flex items-center justify-center flex-col gap-6'>
            <h1 className='text-white text-3xl font-bold flex items-center gap-2'>
                <LucideKey className='w-[1.875rem] h-[1.875rem]' />  
                Recuperar Senha
            </h1>
            <p className='text-white text-xs'>Informe seu e-mail para que possamos enviar o link de recuperação de senha.</p>
              </div>
               <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                        <Input placeholder="seu@email.com" {...field} className='text-xs' disabled={loading} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                      />
                      {
                          message && (
                              <p className='text-white text-xs text-center' >{message}</p>
                          )
                      }
                 <Button 
                    className='bg-black/30 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4 cursor-pointer w-full' 
                    type="submit"
                    disabled={loading}
                    >
                    {
                              loading ? 'Enviando...' : 'Enviar'
                    }
                    
                </Button>
            </form>
            </Form>
        </div>
    </div>
            
  )
}
