'use client'
import { GradientText } from '@/components/app-gradient-text'
import StarGrid from '@/components/app-stars-grid'
import Image from 'next/image'
import React from 'react'
import {motion} from 'framer-motion';
import { AppCtaButton } from '@/components/app-cta-button'
import Link from 'next/link'

const TITLE_DELAY = 0;
const TITLE_DURATION = 1;
const DESCRIPTION_DELAY = TITLE_DURATION - 0.3;
const DESCRIPTION_DURATION = 2;
const CTA_DELAY = DESCRIPTION_DELAY + DESCRIPTION_DURATION - 0.8;
const CTA_DURATION = 0.6;
const HERO_DELAY = CTA_DELAY + CTA_DURATION;
const HERO_DURATION = 1;

export default function HeroSection() {
  return (
    <section className="relative flex flex-col justify-start items-start sm:items-center sm:justify-center gap-4">
      <StarGrid/>
      <motion.h1
        initial={{
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            delay: TITLE_DELAY,
            duration: TITLE_DURATION,
            ease: [0.25, 1, 0.5, 1]
          }
        }}
        className="text-4xl font-bold lg:text-5xl text-text-foreground text-center z-1"
      >
        Turn Conversations into <GradientText>Conversions</GradientText><br/ > Smart Chatbots for Your Business
      </motion.h1>
      <motion.p
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            delay: DESCRIPTION_DELAY,
            duration: DESCRIPTION_DURATION,
            ease: [0.16, 1, 0.3, 1]
          }
        }}
        className="w-full text-text text-center z-1"
      >
        The AI features you need to grow your business fast.
      </motion.p>
      <div className="w-full text-center">
        <motion.div
          className="inline-block"
          initial={{
            opacity: 0,
            scale: 1.5
          }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              delay: CTA_DELAY,
              duration: CTA_DURATION,
              ease: [0.33, 1, 0.68, 1]
            }
          }}
        >
          <AppCtaButton>
            <Link href="/sign-up">
              Get Started
            </Link>
          </AppCtaButton>
        </motion.div>
      </div>

      <motion.div
        style={{
          transformPerspective: '800px'
        }}
        initial={{
          opacity: 0,
          rotateX: 20,
          y: 100
        }}
        animate={{
          opacity: 1,
          rotateX: 0,
          y: 0,
          transition: {
            delay: HERO_DELAY,
            duration: HERO_DURATION,
            ease: [0.33, 1, 0.68, 1]
          }
        }}
        className="glass-container mt-8"
      >
        <div className="absolute inset-0 z-[-1] bg-[#711000] blur-2xl filter"/>
        <Image
          src="/images/fincent-home.png"
          width={0}
          height={0}
          alt='product screenshot'
          sizes='4'
          className="w-[100%] z-1 p-4"
          style={{
            borderRadius: '25px'
          }}
        />
      </motion.div>
    </section>
  )
}
