'use client'
import React from 'react'
import { Button } from './button'
import { LucideLogOut } from 'lucide-react'

export default function LogoutButton({ signOut } = {
    signOut: () => {}
  
}) {
  return (
    <Button className='bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md cursor-pointer' onClick={() => signOut()}>
        Sair
        <LucideLogOut />
    </Button>
  )
}
