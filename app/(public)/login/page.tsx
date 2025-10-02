"use client"

import { LoginForm } from "@/features/auth/LoginForm"
import Link from "next/link"
import AuthHeader from "@/components/shared/AuthHeader"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-card flex justify-center py-8 px-4 shadow-lg border border-border sm:rounded-lg sm:px-10">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
