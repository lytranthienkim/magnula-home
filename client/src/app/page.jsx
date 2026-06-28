'use client'

import { Footer } from "@/components/common/navigation/Footer"
import { HomeSection } from "@/components/layout/home/HomeSection"

export default function HomePage() {
  return (
    <div className="w-full">
      <div className="flex flex-col">
        <HomeSection />
        <Footer />
      </div>
    </div>
  )
}