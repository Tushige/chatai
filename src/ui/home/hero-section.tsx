import { GradientText } from '@/components/app-gradient-text'
import StarGrid from '@/components/app-stars-grid'
import Image from 'next/image'
import React from 'react'

export default function HeroSection() {
  return (
    <section className="relative flex flex-col justify-start items-start sm:items-center sm:justify-center gap-4">
      <StarGrid/>
      <h1 className="text-4xl font-bold lg:text-5xl text-text-foreground text-center z-1">
        Turn Conversations into <GradientText>Conversions</GradientText>:<br/ > Smart Chatbots for Your Business
      </h1>
      <p className="text-text text-center z-1">
        The AI features you need to grow your business fast.
      </p>
      <div className="glass-container mt-8">
        <div className="absolute inset-0 z-[-1] bg-[#711000] blur-2xl filter"/>
        <Image
          src="/images/desktop-3.png"
          // src="/images/appwrite-dashboard.png"
          width={1024}
          height={1024}
          alt='product screenshot'
          sizes='30'
          className="max-w-[100%] z-1 p-4"
          style={{
            borderRadius: '25px'
          }}
        />
      </div>
    </section>
  )
}
