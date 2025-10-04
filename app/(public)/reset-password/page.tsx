"use client"

import { ResetPasswordForm } from "@/features/auth/ResetPasswordForm"
import AuthHeader from "@/components/shared/AuthHeader"
import { Suspense } from "react"

function ResetPasswordContent() {
  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-card flex justify-center py-8 px-4 shadow-lg border border-border sm:rounded-lg sm:px-10">
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
