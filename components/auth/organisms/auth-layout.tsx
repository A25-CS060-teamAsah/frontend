'use client';

import { ReactNode } from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: ReactNode;
  type: 'login' | 'register';
}

export function AuthLayout({ children, type }: AuthLayoutProps) {
  const isLogin = type === 'login';

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {isLogin ? (
        <>
          <div className="flex-1 bg-[#183495] p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
            <div className="text-center mb-8 lg:mb-16">
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
                Welcome To
              </h1>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
                LeadScore PortaL
              </h1>
              <p className="text-white text-base sm:text-lg">
                Empowering Smarter Banking decisions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-12 justify-center items-center mt-6 lg:mt-12">
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32">
                  <Image
                    src="/login/analyzeLead.svg"
                    alt="Analyze Lead"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-white text-sm sm:text-base font-medium">
                  Analyze Lead
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32">
                  <Image
                    src="/login/improveEfficiency.svg"
                    alt="Improve Efficiency"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-white text-sm sm:text-base font-medium">
                  Improve Efficiency
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32">
                  <Image
                    src="/login/aiPowered.svg"
                    alt="AI-Powered"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-white text-sm sm:text-base font-medium">
                  AI-Powered
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-[#183495] p-6 sm:p-8 lg:p-12 flex items-center justify-center">
            {children}
          </div>
        </>
      ) : (
        <>
          <div className="flex-1 bg-[#183495] p-6 sm:p-8 lg:p-12 flex flex-col justify-center items-center">
            <div className="text-center">
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
                Welcome To
              </h1>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
                LeadScore PortaL
              </h1>
              <p className="text-white text-base sm:text-lg mb-6 sm:mb-8">
                Empowering Smarter Banking decisions.
              </p>
            </div>
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg h-64 sm:h-80 lg:h-96">
              <Image
                src="/login/metrics.svg"
                alt="Metrics"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex-1 bg-white p-6 sm:p-8 lg:p-12 flex items-center justify-center">
            {children}
          </div>
        </>
      )}
    </div>
  );
}
