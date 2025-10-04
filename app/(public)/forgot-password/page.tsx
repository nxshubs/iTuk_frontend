"use client"

import { ForgotPasswordForm } from "@/features/auth/ForgotPasswordForm"
import AuthHeader from "@/components/shared/AuthHeader"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-card flex justify-center py-8 px-4 shadow-lg border border-border sm:rounded-lg sm:px-10">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  )
}
