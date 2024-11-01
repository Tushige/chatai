'use client';
import React from 'react';

export function HomeSectionTitle({title, description}: {
  title: string,
  description: string
}) {
  return (
    <div 
      className="w-full"
    >
      <h2 className="text-center font-bold text-3xl tracking-tighter lg:text-5xl">
        {title} 
      </h2>
      <p className="text-text-secondary mt-2 text-center">
        {description}
      </p>
    </div>
  )
}