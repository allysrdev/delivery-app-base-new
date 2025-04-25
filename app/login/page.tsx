"use client"
import React from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import Link from 'next/link'
import { LucideUser } from 'lucide-react'
import { FcGoogle } from "react-icons/fc"
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'

const formSchema = z.object({
  email: z.string().email({ message: "Insira um e-mail válido" }),
  password: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres" }),
})

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error('Credenciais inválidas')
      }

      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (err) {
      setError(err as string)
    }
  }

  return (
    <div className='w-full h-[100vh] flex flex-col items-center overflow-hidden'>
      <div className='bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md p-6 w-full h-[85%] flex items-center justify-center flex-col gap-8'>
        <div className='flex items-center justify-center flex-col gap-6'>
          <h1 className='text-white text-3xl font-bold flex items-center gap-2'>
            <LucideUser className='w-[1.875rem] h-[1.875rem]' />  
            Login
          </h1>
          <p className='text-white text-xs'>Entre com seu email e senha para acessar sua conta</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 min-w-52">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      className='text-xs'
                      placeholder="seu@email.com"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      className='text-xs'
                      type="password"
                      placeholder="Insira a sua senha"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div className='w-full flex flex-col gap-4 items-start'>
              <Button 
                className='bg-black/30 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4 cursor-pointer w-full' 
                type="submit"
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin" /> : 'Entrar'}
              </Button>

              <div className='flex items-center gap-2 w-full'>
                <Button 
                  className='bg-black/30 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4 cursor-pointer flex-1' 
                  type="button"
                  onClick={() => router.push('/signup')}
                >
                  Criar uma Conta
                </Button>

                <Button 
                  className='bg-white/90 backdrop-blur-md border border-zinc-300 shadow-lg rounded-md p-4 cursor-pointer text-black/70 hover:bg-white/80 flex-1' 
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <FcGoogle className="mr-2" />
                  Google
                </Button>
              </div>

              <Link 
                className='text-blue-500 hover:text-blue-600 underline flex items-center justify-center gap-2 text-xs w-full' 
                href="/forgot-password"
              >
                Esqueci minha senha
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}