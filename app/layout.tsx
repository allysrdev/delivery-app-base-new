
import type { Metadata } from 'next';
import './globals.css';
import { LucideHouse, LucideReceiptText, LucideSearch, LucideUser } from 'lucide-react';
import Link from 'next/link';
import { CldOgImage } from 'next-cloudinary';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import Image from 'next/image';
import { CartProvider } from './context/CartContext';
import ClientAuthCheck from '@/services/ClientAuthCheck';
import { headers } from 'next/headers';
import { StoreProvider } from './context/StoreContext';
import { getUser } from '@/services/userService';
import { Providers } from '@/providers/QueryClientProvider';

export const metadata: Metadata = {
  title: 'Borchelle Fast Food',
  description: 'Loja de lanches',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const headersList = headers();
  const pathname = (await headersList).get('x-url-pathname') || '';
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin');
  const user = await getUser(session?.user?.email || '')
  const userProfilePhoto = user?.profileImage
  return (
    <html lang="en">
      <script src="https://upload-widget.cloudinary.com/global/all.js" async defer />
      {session?.user?.email && <ClientAuthCheck email={session.user.email} />}

      <body className="antialiased p-4">
        <SessionProvider>
          <StoreProvider>
            <CartProvider>
              <Providers>
                {children}
              </Providers>
            </CartProvider>
          <CldOgImage src="og-image" alt="social image" />

          {!isAdminRoute && (
            <nav className="bg-black/30 h-14 backdrop-blur-md border border-white/10 shadow-lg rounded-md fixed bottom-0 left-0 w-full flex items-center justify-around">
              <Link href="/" className="rounded-md p-2 hover:bg-zinc-600 cursor-pointer">
                <LucideHouse />
              </Link>
              <Link href="/search" className="rounded-md p-2 hover:bg-zinc-600 cursor-pointer">
                <LucideSearch />
              </Link>
              <Link href="/pedidos" className="rounded-md p-2 hover:bg-zinc-600 cursor-pointer">
                <LucideReceiptText />
              </Link>
              <Link href="/user" className="rounded-md p-2 hover:bg-zinc-600 cursor-pointer">
                {userProfilePhoto ? (
                  <Image
                    src={userProfilePhoto}
                    width={35}
                    height={35}
                    alt="user-image"
                    className="rounded-full object-cover border-[2.5px] border-[#ededed] h-9 w-9"
                  />
                ) : (
                  <LucideUser />
                )}
              </Link>
            </nav>
            )}
            </StoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
