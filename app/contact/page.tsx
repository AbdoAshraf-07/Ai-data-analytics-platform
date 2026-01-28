"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { BarChart3, Phone, Mail, Send, MessageCircle, Clock, Languages, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"

export default function ContactPage() {
  const [language, setLanguage] = useState<"ar" | "en">("en")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const { theme, setTheme } = useTheme()

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ar" ? "en" : "ar"))
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    alert(language === "ar" ? "تم إرسال رسالتك بنجاح!" : "Message sent successfully!")
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  const content = {
    ar: {
      title: "Smart Data Insight",
      subtitle: "تحليل البيانات بالذكاء الاصطناعي",
      contactUs: "اتصل بنا",
      contactDescription: "نحن هنا لمساعدتك. تواصل معنا في أي وقت",
      getInTouch: "تواصل معنا",
      name: "الاسم",
      email: "البريد الإلكتروني",
      subject: "الموضوع",
      message: "الرسالة",
      sendMessage: "إرسال الرسالة",
      contactInfo: "معلومات الاتصال",
      phone: "الهاتف",
      emailLabel: "البريد الإلكتروني",
      workingHours: "ساعات العمل",
      workingHoursText: "الأحد - الخميس: 9:00 ص - 6:00 م",
      quickContact: "اتصال سريع",
      callNow: "اتصل الآن",
      emailNow: "راسلنا الآن",
      backToHome: "العودة للرئيسية",
    },
    en: {
      title: "Smart Data Insight",
      subtitle: "AI-Powered Data Analysis",
      contactUs: "Contact Us",
      contactDescription: "We're here to help you. Get in touch with us anytime",
      getInTouch: "Get in Touch",
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
      sendMessage: "Send Message",
      contactInfo: "Contact Information",
      phone: "Phone",
      emailLabel: "Email",
      workingHours: "Working Hours",
      workingHoursText: "Sunday - Thursday: 9:00 AM - 6:00 PM",
      quickContact: "Quick Contact",
      callNow: "Call Now",
      emailNow: "Email Now",
      backToHome: "Back to Home",
    },
  }

  const t = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.subtitle}</p>
              </div>
            </Link>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="p-2 transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
              >
                <Languages className="h-4 w-4" />
                <span className="ml-1 text-sm font-medium">{language.toUpperCase()}</span>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <Link href="/">
                <Button variant="outline" className="transition-all duration-300 hover:scale-105 bg-transparent">
                  {t.backToHome}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{t.contactUs}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t.contactDescription}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
                  {t.getInTouch}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t.name}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 transition-all duration-300 focus:scale-105"
                      placeholder={language === "ar" ? "أدخل اسمك" : "Enter your name"}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t.email}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 transition-all duration-300 focus:scale-105"
                      placeholder={language === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t.subject}
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="mt-1 transition-all duration-300 focus:scale-105"
                      placeholder={language === "ar" ? "موضوع الرسالة" : "Message subject"}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t.message}
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="mt-1 transition-all duration-300 focus:scale-105"
                      placeholder={language === "ar" ? "اكتب رسالتك هنا..." : "Write your message here..."}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {t.sendMessage}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Info Card */}
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{t.contactInfo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{t.phone}</h3>
                      <p className="text-gray-600 dark:text-gray-300">01101185459</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{t.emailLabel}</h3>
                      <p className="text-gray-600 dark:text-gray-300">aahmedhanyy11@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{t.workingHours}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{t.workingHoursText}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact Card */}
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{t.quickContact}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <a href="tel:01101185459" className="block">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95">
                      <Phone className="h-4 w-4 mr-2" />
                      {t.callNow}
                    </Button>
                  </a>

                  <a href="mailto:aahmedhanyy11@gmail.com" className="block">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95">
                      <Mail className="h-4 w-4 mr-2" />
                      {t.emailNow}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="h-6 w-6" />
                <span className="text-xl font-bold">{t.title}</span>
              </div>
              <p className="text-gray-400">{t.subtitle}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>built by A7med Hany</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
