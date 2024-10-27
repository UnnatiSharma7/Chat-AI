import React from 'react'
import './rootLayout.css'
import {Link, Outlet} from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react'
import { SignedIn, UserButton } from "@clerk/clerk-react";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const RootLayout = () => {
  
  console.log("Publishable Key:", import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log("Publishable Key:", PUBLISHABLE_KEY);

  if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
  }

  const queryClient = new QueryClient();

  return (
    
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <QueryClientProvider client={queryClient}>
    <div className="rootLayout"> 
    <header>
        <Link to="/" className="logo">
        <img src="/logo.png" alt="" />
        <span>CHAT AI</span>
        </Link>
        <div className="user">
      <SignedIn>
        <UserButton />
      </SignedIn>
        </div>
    </header>
    <main>
        <Outlet></Outlet>
    </main>
    </div>
    </QueryClientProvider>
    </ClerkProvider>
    
  )
}

export default RootLayout