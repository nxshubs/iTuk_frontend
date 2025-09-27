"use client"

import SignUpForm from "@/features/auth/SignUpForm"
import Link from "next/link"
import AuthHeader from "@/components/shared/AuthHeader"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24">
        <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center justify-center pt-8">
          <Link href="/" className="flex items-center justify-center w-64 h-16">
            <img
              src="logotipo.png"
              alt="ConnectaServiços Logo (Modo Claro)"
              className="rounded-lg block dark:hidden w-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://placehold.co/144x144/ffffff/333333?text=Logo+1';
              }}
            />
            <img
              src="logotipo_2.png"
              alt="ConnectaServiços Logo (Modo Escuro)"
              className="rounded-lg hidden dark:block"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://placehold.co/144x144/333333/ffffff?text=Logo+2';
              }}
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">Criar nova conta</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground font-poppins">
            Ou{" "}
            <Link href="/login" className="font-medium text-[#FC9056] hover:text-[#ff3a20] font-poppins">
              faça login em conta existente
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-card py-8 px-4 shadow-lg border border-border sm:rounded-lg sm:px-10">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  )
}
