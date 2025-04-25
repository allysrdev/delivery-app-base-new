"use client"
import {  LucideUserCheck } from 'lucide-react'
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
import { redirect, useSearchParams } from 'next/navigation'


const formSchema = z.object({
    password: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres" }),
})
 

export default function ForgotPassword() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [message, setMessage] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const res = await fetch('api/reset-password', {
            method: "POST",
            body: JSON.stringify({
                token,
                password: values.password
            })
        })

        const data = await res.json()
        setMessage(data.message || data.error)

        if (data.error) {
            return 
        } else {
            setTimeout(() => {
                setMessage('Redirecionando...')
                redirect('/login')
            }, 2000)
        }
    }

  return (
    <div className='w-full h-[100vh] flex flex-col items-center overflow-hidden'>
      <div className='bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md p-6 w-full h-[85%] flex items-center justify-center flex-col gap-8'>
            <div className='flex items-center justify-center flex-col gap-6'>
            <h1 className='text-white text-3xl font-bold flex items-center gap-2'>
                <LucideUserCheck className='w-[1.875rem] h-[1.875rem]' />  
                Recuperar Senha
            </h1>
            <p className='text-white text-xs'>Insira a sua nova senha.</p>
              </div>
               <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nova senha</FormLabel>
                    <FormControl>
                        <Input type='password' placeholder="Insira sua nova senha" {...field} className='text-xs' />
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
                    >
                    Atualizar senha
                    
                </Button>
            </form>
            </Form>
        </div>
    </div>
            
  )
}
