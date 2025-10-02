"use client"

import SignUpForm from "@/features/auth/SignUpForm"
import Link from "next/link"
import AuthHeader from "@/components/shared/AuthHeader"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div >
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  )
}
