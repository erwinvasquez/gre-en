"use client"

import { AnimatedElement } from "@/components/AnimatedElement"

export default function AboutSection() {
  return (
    <section
      id="about-us"
      className="section-container section-padding min-h-screen-navbar bg-slate-50 flex flex-col items-center justify-center"
    >
      <AnimatedElement animation="fade-in" duration="slow">
        <h1 className="text-5xl">About</h1>
      </AnimatedElement>

      <AnimatedElement animation="slide-up" delay={300} className="mt-8 max-w-2xl text-center">
        <p className="text-lg text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat
          molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
        </p>
      </AnimatedElement>
    </section>
  )
}



  