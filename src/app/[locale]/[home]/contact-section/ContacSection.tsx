"use client"

import { AnimatedElement } from "@/components/AnimatedElement"

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="section-container section-padding min-h-screen-navbar bg-slate-50 flex flex-col items-center justify-center"
    >
      <AnimatedElement animation="fade-in" duration="slow">
        <h1 className="text-5xl">Contact</h1>
      </AnimatedElement>

      <AnimatedElement animation="scale-in" delay={300} className="mt-8">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Mensaje
              </label>
              <textarea
                id="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </AnimatedElement>
    </section>
  )
}


