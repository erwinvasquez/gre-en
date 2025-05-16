"use client"

import { useTranslations } from "next-intl"
import { Container } from "@/components/ui/container"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { SwitchLanguage } from "@/components/switchlanguage/SwitchLanguage"
import { useTheme } from "next-themes"

export const Footer = () => {
  const t = useTranslations("Footer")
  const { theme } = useTheme()
  const currentYear = new Date().getFullYear()

  // Redes sociales
  const socialMedia = [
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      url: "https://facebook.com",
      color: "hover:bg-blue-600",
    },
    { name: "Twitter", icon: <Twitter className="h-5 w-5" />, url: "https://twitter.com", color: "hover:bg-sky-500" },
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      url: "https://instagram.com",
      color: "hover:bg-pink-600",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      url: "https://linkedin.com",
      color: "hover:bg-blue-700",
    },
    { name: "YouTube", icon: <Youtube className="h-5 w-5" />, url: "https://youtube.com", color: "hover:bg-red-600" },
  ]

  return (
    <footer className="border-t border-gray-800 text-white" style={{ backgroundColor: "hsl(var(--color-gray-900))" }}>
      {/* Main Footer Content */}
      <Container size="xlarge" className="px-4 md:px-8 lg:px-12 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Info - Column 1 */}
          <div className="font-[var(--font-body)]">
            <h3 className="text-2xl font-semibold mb-6 text-primary font-[var(--font-headings)]">{t("contactUS")}</h3>
            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm">{t("address")}</h4>
                  <p className="text-gray-300 text-xs">Green Tower, oficina 1707, piso 17</p>
                  <p className="text-gray-300 text-xs">Av. San Martin calle G</p>
                  <p className="text-gray-300 text-xs">Santa Cruz de la Sierra</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm">{t("phone")}</h4>
                  <a
                    href="tel:+11234567890"
                    className="text-gray-300 hover:text-primary transition-colors text-xs block"
                  >
                    +1 (123) 456-7890
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm">{t("email")}</h4>
                  <a
                    href="mailto:info@greenenergy.com"
                    className="text-gray-300 hover:text-primary transition-colors text-xs"
                  >
                    info@greenenergy.com
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm">{t("hours")}</h4>
                  <p className="text-gray-300 text-xs">Mon-Fri: 9AM-6PM</p>
                  <p className="text-gray-300 text-xs">Sat: 10AM-2PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links - Two Columns */}
          <div className="grid grid-cols-2 gap-4 font-[var(--font-body)]">
            {/* Solutions & Sectors */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary font-[var(--font-headings)]">{t("solutions")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                    {t("links.solutions.bipv")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                    {t("links.solutions.photovoltaic")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                    {t("links.solutions.wind")}
                  </Link>
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-5 text-primary font-[var(--font-headings)]">
                {t("sectors")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                    {t("links.sectors.residential")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                    {t("links.sectors.commercial")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                    {t("links.sectors.industrial")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                    {t("links.sectors.public")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company & Support */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary font-[var(--font-headings)]">{t("company")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                    {t("links.company.about")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                    {t("links.company.team")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                    {t("links.company.careers")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                    {t("links.company.news")}
                  </Link>
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-5 text-primary font-[var(--font-headings)]">
                {t("support")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                    {t("links.support.contact")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                    {t("links.support.faq")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                    {t("links.support.resources")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Map and Social Media - Column 3-4 */}
          <div className="col-span-1 lg:col-span-2 font-[var(--font-body)] flex flex-col items-center">
            <div className="space-y-6 w-full">
              {/* Map */}
              <div className="h-[180px] w-full rounded-lg overflow-hidden border border-gray-700">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3799.0!2d-63.1997181!3d-17.7595633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDQ1JzM0LjQiUyA2M8KwMTEnNTkuMCJX!5e0!3m2!1ses!2sbo!4v1715511731626!5m2!1ses!2sbo"
                  width="100%"
                  height="180"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Green Energy Location"
                ></iframe>
              </div>

              {/* Social Media */}
              <div className="w-full">
                <h3 className="text-xl font-semibold mb-4 text-primary font-[var(--font-headings)] text-center">
                  {t("followUs")}
                </h3>
                <div className="flex justify-center gap-4">
                  {socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        bg-gray-800 p-3 rounded-full 
                        transition-all duration-300 
                        hover:scale-110 hover:shadow-lg hover:shadow-green-500/20
                        ${social.color}
                      `}
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800 py-4">
        <Container size="full" className="px-4 md:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-4">
              <Image src="/green-energy-logo.png" alt="Green Energy" width={120} height={40} />
            </div>
            <p className="text-sm text-gray-400 font-[var(--font-body)]">
              &copy; {currentYear} Green Energy. {t("allRightsReserved")}
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex space-x-4 text-sm font-[var(--font-body)]">
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                {t("privacyPolicy")}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                {t("termsOfService")}
              </Link>
            </div>
            <SwitchLanguage />
          </div>
        </Container>
      </div>
    </footer>
  )
}









  