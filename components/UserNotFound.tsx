import { LogIn, LucideUserRoundX } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function UserNotFound() {
  return (
    <div className='flex flex-col items-center justify-center gap-2 g-black/30 backdrop-blur-md border border-white/50 shadow-lg p-6 rounded-md'>
        <LucideUserRoundX />
        <h1 className='font-bold'>Você ainda não fez login.</h1>
        <Link href="/login"  className="text-blue-500 hover:text-blue-600 underline flex items-center justify-center gap-2">
          Faça login <LogIn />
        </Link>
      </div>
  )
}

export default UserNotFound