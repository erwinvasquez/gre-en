"use client"

import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { AnimatedElement } from "@/components/AnimatedElement"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"
import { ContactForm } from "@/components/ContactForm"

export default function ContactPage() {
  return (
    <Section id="contacto" heightType="content" fullWidth={true} className="bg-background">
      <Container size="xlarge" className="py-16 md:py-24">
        <AnimatedElement animation="slide-up" className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold text-foreground">Contacto</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ¿Tienes alguna pregunta? Estamos aquí para ayudarte
          </p>
        </AnimatedElement>

        <div className="max-w-2xl mx-auto">
          <AnimatedElement animation="slide-up">
            <Card>
              <CardHeader>
                <CardTitle>Envíanos un mensaje</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </AnimatedElement>
        </div>
      </Container>
    </Section>
  )
} 