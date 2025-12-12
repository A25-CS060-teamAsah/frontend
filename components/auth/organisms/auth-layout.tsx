"use client";
import { ReactNode } from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: ReactNode;
  type: "login" | "register";
}

export function AuthLayout({ children, type }: AuthLayoutProps) {
  const isLogin = type === "login";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#183495] via-[#1a3a9d] to-[#0E2A7D] relative overflow-hidden">
      {/* Subtle pattern overlay - FULL SCREEN */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Decorative gradient orbs for depth - FULL SCREEN */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl pointer-events-none"></div>

      {isLogin ? (
        <>
          {/* LOGIN PAGE - Left Side */}
          <div className="flex-1 p-6 sm:p-8 lg:p-12 flex flex-col justify-center relative z-10">
            <div className="text-center mb-8 lg:mb-12">
              {/* Logo - HANYA DI LOGIN PAGE */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 shadow-2xl rounded-2xl bg-white/5 p-3 sm:p-4 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:shadow-blue-500/20 hover:bg-white/10 border border-white/10">
                  <Image
                    src="/login/logo.svg"
                    alt="LeadScore Portal Logo"
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                </div>
              </div>
              
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 drop-shadow-lg">
                Welcome To
              </h1>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
                LeadScore Portal
              </h1>
              <p className="text-white/90 text-base sm:text-lg drop-shadow-md">
                Empowering Smarter Banking decisions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-12 justify-center items-center mt-6 lg:mt-12">
              <div className="flex flex-col items-center gap-2 sm:gap-3 group">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 transition-transform duration-300 group-hover:scale-110">
                  <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl group-hover:bg-white/10 transition-all"></div>
                  <Image src="/login/analyzeLead.svg" alt="Analyze Lead" fill className="object-contain drop-shadow-lg relative z-10" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 sm:gap-3 group">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 transition-transform duration-300 group-hover:scale-110">
                  <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl group-hover:bg-white/10 transition-all"></div>
                  <Image src="/login/improveEfficiency.svg" alt="Improve Efficiency" fill className="object-contain drop-shadow-lg relative z-10" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 sm:gap-3 group">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 transition-transform duration-300 group-hover:scale-110">
                  <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl group-hover:bg-white/10 transition-all"></div>
                  <Image src="/login/aiPowered.svg" alt="AI-Powered" fill className="object-contain drop-shadow-lg relative z-10" />
                </div>
              </div>
            </div>
          </div>

          {/* LOGIN PAGE - Right Side (Form) */}
          <div className="flex-1 p-6 sm:p-8 lg:p-12 flex items-center justify-center relative z-10">
            {children}
          </div>
        </>
      ) : (
        <>
          {/* REGISTER PAGE - Left Side */}
          <div className="flex-1 p-6 sm:p-8 lg:p-12 flex flex-col justify-center items-center relative z-10">
            <div className="text-center">
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 drop-shadow-lg">
                Welcome To
              </h1>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
                LeadScore Portal
              </h1>
              <p className="text-white/90 text-base sm:text-lg mb-6 sm:mb-8 drop-shadow-md">
                Empowering Smarter Banking decisions.
              </p>

              {/* Ilustrasi metrics untuk register page */}
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg h-72 sm:h-96 lg:h-[30rem] mx-auto">
                <Image src="/login/metrics.svg" alt="Metrics Illustration" fill className="object-contain drop-shadow-2xl" />
              </div>
            </div>
          </div>

          {/* REGISTER PAGE - Right Side (Form) */}
          <div className="flex-1 bg-white p-6 sm:p-8 lg:p-12 flex items-center justify-center relative z-10">
            {children}
          </div>
        </>
      )}
    </div>
  );
}