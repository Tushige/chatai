"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import {
  IconBrandHipchat,
  IconMail,
  IconMessage,
  IconCalendarEvent,
} from "@tabler/icons-react";
import {BentoGrid, BentoGridItem} from '@/components/ui/bento-grid';
import { animate, motion, useInView } from "framer-motion";
import Image from "next/image";
import { BotIcon } from "lucide-react";
import { HomeSectionTitle } from "./home-section-title";

export function FeaturesSection() {
  const containerRef = useRef (null);
  const isInView = useInView(containerRef);

  useEffect(() => {
    if (isInView) {
      animate(containerRef.current, {
        opacity: 1,
        y: 0
      }, {
        duration: 0.3,
        ease: 'easeIn'
      })
    }
  }, [isInView]);

  return (
    <div>
      <motion.div className="relative" ref={containerRef} initial={{opacity: 0, y:100}}>
        <HomeSectionTitle title="Features" description="Introducing a new way of generating leads for your businesses"/>
      </motion.div>
      <BentoGrid className="mt-16 grid max-w-4xl grid-rows-[auto_auto_auto] gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-10">
        {items.map((item, i) => (
          <div className="glass-container" key={`${item.title}-${i}`}>
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={cn("[&>p:text-lg] h-full bg-background", item.className)}
              icon={item.icon}
            />
          </div>
        ))}
      </BentoGrid>
    </div>
    // <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
  );
}

const items = [
  {
    title: "Realtime chat support",
    description: (
      <div className="flex flex-col gap-2 justify-center">
        <span className="text-sm text-text-secondary">
        Our bot will notify you when customers require assistance, allowing you to engage in real-time conversations and provide timely support.
        </span>
        <a href="https://youtu.be/bAmtsxzDKPY" className="flex flex-row items-center gap-2">
          <Image
            src="/images/icons8-youtube.svg"
            width="48"
            height="48"
            alt="youtube icon"
            className="relative bg-background"
          />
          <span>Watch DEMO</span>
        </a>
      </div>
    ),
    header: (
      <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-xl">
        <Image
          src="/images/chat-support.svg"
          layout="fill"
          objectFit="cover"
          alt="chat-support image"
          className="relative rounded-lg"
        />
      </div>
    ),
    className: "md:col-span-1",
    icon: <IconBrandHipchat className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Email Campaigns",
    description: (
      <div className="flex flex-col gap-2 justify-center">
        <span className="text-sm text-text-secondary">
          Efficiently manage your contacts and streamline your email campaigns from a centralized platform.
        </span>
      </div>
    ),
    header: (
      <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-xl">
        <Image
          src="/images/email-campaign.svg"
          layout="fill"
          objectFit="cover"
          alt="appointment image"
          className="relative rounded-lg"
        />
      </div>
    ),
    className: "md:col-span-1",
    icon: <IconMail className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Chat History",
    description: (
      <div className="flex flex-col gap-2 justify-center">
        <span className="text-sm text-text-secondary">
          View all your conversations and monitor online presence.
        </span>
      </div>
    ),
    header: (
      <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-xl">
        <Image
          src="/images/conversation.svg"
          layout="fill"
          objectFit="cover"
          alt="conversation image"
          className="relative rounded-lg"
        />
      </div>
    ),
    className: "md:col-span-1",
    icon: <IconMessage className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Appointments",
    description: (
    <div className="flex flex-col gap-2 justify-center">
      <span className="text-sm text-text-secondary">
      Schedule product demo appointments and easily access them through your dashboard
      </span>
      <a href="https://www.youtube.com/watch?v=N9sLKH5Nlko" className="flex flex-row items-center gap-2">
        <Image
          src="/images/icons8-youtube.svg"
          width="48"
          height="48"
          alt="youtube icon"
          className="relative bg-background"
        />
        <span>Watch DEMO</span>
      </a>
    </div>
    ),
    header: (
      <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-xl">
        <Image
          src="/images/appointments.svg"
          layout="fill"
          objectFit="cover"
          alt="appointment image"
          className="relative rounded-lg"
        />
      </div>
    ),
    className: "md:col-span-2",
    icon: <IconCalendarEvent className="h-4 w-4 text-neutral-500" />,
  },

  {
    title: "Chatbot",
    description: (
      <div className="flex flex-col gap-2 justify-center">
        <span className="text-sm text-text-secondary">
        Configure your bot to engage customers with personalized questions and represent your business.
        </span>
      </div>
    ),
    header: (
      <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-xl">
        <Image
          src="/images/chatbot.svg"
          layout="fill"
          objectFit="cover"
          alt="appointment image"
          className="relative rounded-lg"
        />
      </div>
    ),
    className: "md:col-span-1",
    icon: <BotIcon className="h-4 w-4 text-neutral-500" />,
  },
];
