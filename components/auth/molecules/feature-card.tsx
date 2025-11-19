"use client"

import Image from "next/image"

interface FeatureCardProps {
  icon: string
  title: string
}

export function FeatureCard({ icon, title }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <Image
          src={icon}
          alt={title}
          fill
          className="object-contain"
        />
      </div>
      <p className="text-white text-sm font-medium">{title}</p>
    </div>
  )
}


