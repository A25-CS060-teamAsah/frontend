"use client"

import { ReactNode } from "react"
import Image from "next/image"

interface AuthLayoutProps {
  children: ReactNode
  type: "login" | "register"
}

export function AuthLayout({ children, type }: AuthLayoutProps) {
  const isLogin = type === "login"

  return (
    <div className="min-h-screen flex">
      {isLogin ? (
        /* Login Layout - Full Blue Background */
        <>
          <div className="flex-1 bg-[#183495] p-12 flex flex-col justify-center">
            <div className="text-center mb-16">
              <h1 className="text-white text-5xl font-bold mb-3">
                Welcome To
              </h1>
              <h1 className="text-white text-6xl font-bold mb-4">
                LeadScore Portal
              </h1>
              <p className="text-white text-lg">
                Empowering Smarter Banking decisions.
              </p>
            </div>

            <div className="flex gap-12 justify-center items-center mt-12">
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-32 h-32">
                  <Image
                    src="/login/analyzeLead.svg"
                    alt="Analyze Lead"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-white text-base font-medium">Analyze Lead</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-32 h-32">
                  <Image
                    src="/login/improveEfficiency.svg"
                    alt="Improve Efficiency"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-white text-base font-medium">Improve Efficiency</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-32 h-32">
                  <Image
                    src="/login/aiPowered.svg"
                    alt="AI-Powered"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-white text-base font-medium">AI-Powered</p>
              </div>
            </div>
          </div>

          {/* Right Section - Blue Background with White Form Card */}
          <div className="flex-1 bg-[#183495] p-12 flex items-center justify-center">
            {children}
          </div>
        </>
      ) : (
        /* Register Layout - Half Blue, Half White */
        <>
          <div className="flex-1 bg-[#183495] p-12 flex flex-col justify-center items-center">
            <div className="text-center">
              <h1 className="text-white text-5xl font-bold mb-3">
          Welcome To
              </h1>
              <h1 className="text-white text-6xl font-bold mb-4">
          LeadScore Portal
              </h1>
              <p className="text-white text-lg mb-8">
          Empowering Smarter Banking decisions.
              </p>
            </div>
            <div className="relative w-full max-w-lg h-96">
              <Image
          src="/login/metrics.svg"
          alt="Metrics"
          fill
          className="object-contain"
              />
            </div>
          </div>

          {/* Right Section - White Background */}
          <div className="flex-1 bg-white p-12 flex items-center justify-center">
            {children}
          </div>
        </>
      )}
    </div>
  )
}

