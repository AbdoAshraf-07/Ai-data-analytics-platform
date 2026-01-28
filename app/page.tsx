"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Upload,
  Brain,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Star,
  TrendingUp,
  Moon,
  Sun,
  Languages,
  MessageCircle,
  Database,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ChatAssistant } from "@/components/chat-assistant"

export default function HomePage() {
  const [language, setLanguage] = useState<"ar" | "en">("en")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ar" ? "en" : "ar"))
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const content = {
    ar: {
      title: "Smart Data Insight",
      subtitle: "تحليل البيانات بالذكاء الاصطناعي",
      description: "حول بياناتك إلى رؤى قابلة للتنفيذ باستخدام أدوات التعلم الآلي المتقدمة والتصور التفاعلي",
      getStarted: "ابدأ الآن",
      learnMore: "اعرف المزيد",
      features: "الميزات",
      howItWorks: "كيف يعمل",
      testimonials: "آراء العملاء",
      uploadData: "رفع البيانات",
      uploadDescription: "ارفع ملفات CSV أو اتصل بقواعد البيانات",
      aiAnalysis: "التحليل بالذكاء الاصطناعي",
      aiDescription: "تحليل تلقائي وتنظيف البيانات",
      insights: "الرؤى والتصور",
      insightsDescription: "رسوم بيانية تفاعلية ورؤى قابلة للتنفيذ",
      whyChoose: "لماذا تختار Smart Data Insight؟",
      easyToUse: "سهل الاستخدام",
      easyDescription: "واجهة بديهية لا تتطلب خبرة تقنية",
      powerful: "قوي ومتقدم",
      powerfulDescription: "خوارزميات تعلم آلي متطورة",
      secure: "آمن وموثوق",
      secureDescription: "حماية عالية لبياناتك الحساسة",
      global: "دعم عالمي",
      globalDescription: "متاح بلغات متعددة ودعم 24/7",
      step1: "الخطوة 1",
      step1Title: "رفع البيانات",
      step1Description: "ارفع ملف CSV أو اتصل بقاعدة البيانات",
      step2: "الخطوة 2",
      step2Title: "التحليل التلقائي",
      step2Description: "دع الذكاء الاصطناعي يحلل ويظف بياناتك",
      step3: "الخطوة 3",
      step3Title: "الحصول على الرؤى",
      step3Description: "احصل على رؤى قابلة للتنفيذ ورسوم بيانية",
      testimonial1: "أداة رائعة غيرت طريقة تحليلنا للبيانات",
      testimonial1Author: "أحمد محمد، مدير البيانات",
      testimonial2: "سهولة الاستخدام والنتائج المذهلة",
      testimonial2Author: "فاطمة علي، محللة أعمال",
      testimonial3: "وفر علينا ساعات من العمل اليدوي",
      testimonial3Author: "محمد حسن، عالم بيانات",
      readyToStart: "هل أنت مستعد للبدء؟",
      readyDescription: "انضم إلى آلاف المستخدمين الذين يثقون في Smart Data Insight",
      startFree: "ابدأ مجاناً",
      aiAssistant: "المساعد الذكي",
      smartCleaning: "تنظيف ذكي",
      smartCleaningDesc: "إزالة القيم المفقودة والمكررة تلقائياً",
      advancedML: "تعلم آلي متقدم",
      advancedMLDesc: "نماذج تنبؤية دقيقة وتحليل متطور",
    },
    en: {
      title: "Smart Data Insight",
      subtitle: "AI-Powered Data Analysis",
      description:
        "Transform your data into actionable insights with advanced machine learning tools and interactive visualizations",
      getStarted: "Get Started",
      learnMore: "Learn More",
      features: "Features",
      howItWorks: "How It Works",
      testimonials: "Testimonials",
      uploadData: "Upload Data",
      uploadDescription: "Upload CSV files or connect to databases",
      aiAnalysis: "AI Analysis",
      aiDescription: "Automatic analysis and data cleaning",
      insights: "Insights & Visualization",
      insightsDescription: "Interactive charts and actionable insights",
      whyChoose: "Why Choose Smart Data Insight?",
      easyToUse: "Easy to Use",
      easyDescription: "Intuitive interface requiring no technical expertise",
      powerful: "Powerful & Advanced",
      powerfulDescription: "Sophisticated machine learning algorithms",
      secure: "Secure & Reliable",
      secureDescription: "High-level protection for your sensitive data",
      global: "Global Support",
      globalDescription: "Available in multiple languages with 24/7 support",
      step1: "Step 1",
      step1Title: "Upload Data",
      step1Description: "Upload a CSV file or connect to your database",
      step2: "Step 2",
      step2Title: "Automatic Analysis",
      step2Description: "Let AI analyze and clean your data",
      step3: "Step 3",
      step3Title: "Get Insights",
      step3Description: "Receive actionable insights and visualizations",
      testimonial1: "Amazing tool that transformed our data analysis approach",
      testimonial1Author: "Ahmed Mohamed, Data Manager",
      testimonial2: "Easy to use with stunning results",
      testimonial2Author: "Fatima Ali, Business Analyst",
      testimonial3: "Saved us hours of manual work",
      testimonial3Author: "Mohamed Hassan, Data Scientist",
      readyToStart: "Ready to Get Started?",
      readyDescription: "Join thousands of users who trust Smart Data Insight",
      startFree: "Start Free",
      aiAssistant: "AI Assistant",
      smartCleaning: "Smart Cleaning",
      smartCleaningDesc: "Automatically remove missing and duplicate values",
      advancedML: "Advanced ML",
      advancedMLDesc: "Accurate predictive models and sophisticated analysis",
    },
  }

  const t = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.subtitle}</p>
              </div>
            </div>

            {/* Navigation & Controls */}
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
                  {t.features}
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                >
                  {t.howItWorks}
                </a>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                >
                  {language === "ar" ? "اتصل بنا" : "Contact"}
                </Link>
              </nav>

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

              <Button
                onClick={() => setIsChatOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {t.aiAssistant}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t.title}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {t.subtitle}
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">{t.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                <Upload className="mr-2 h-5 w-5" />
                {t.getStarted}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 bg-transparent"
            >
              {t.learnMore}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.features}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t.whyChoose}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader>
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>{t.uploadData}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{t.uploadDescription}</p>
              </CardContent>
            </Card>

            <Card className="text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Database className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>{t.smartCleaning}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{t.smartCleaningDesc}</p>
              </CardContent>
            </Card>

            <Card className="text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader>
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>{t.advancedML}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{t.advancedMLDesc}</p>
              </CardContent>
            </Card>

            <Card className="text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader>
                <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>{t.easyToUse}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{t.easyDescription}</p>
              </CardContent>
            </Card>

            <Card className="text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader>
                <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>{t.secure}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{t.secureDescription}</p>
              </CardContent>
            </Card>

            <Card className="text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader>
                <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle>{t.global}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{t.globalDescription}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.howItWorks}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Upload className="h-10 w-10" />
              </div>
              <Badge variant="secondary" className="mb-2">
                {t.step1}
              </Badge>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t.step1Title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t.step1Description}</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Brain className="h-10 w-10" />
              </div>
              <Badge variant="secondary" className="mb-2">
                {t.step2}
              </Badge>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t.step2Title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t.step2Description}</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <TrendingUp className="h-10 w-10" />
              </div>
              <Badge variant="secondary" className="mb-2">
                {t.step3}
              </Badge>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t.step3Title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t.step3Description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.testimonials}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">"{t.testimonial1}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900 dark:text-white">{t.testimonial1Author}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">"{t.testimonial2}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                    F
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900 dark:text-white">{t.testimonial2Author}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">"{t.testimonial3}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                    M
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900 dark:text-white">{t.testimonial3Author}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t.readyToStart}</h2>
          <p className="text-xl text-blue-100 mb-8">{t.readyDescription}</p>
          <Link href="/upload">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              {t.startFree}
            </Button>
          </Link>
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
              <p className="text-gray-400">{t.description}</p>
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
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
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

      {/* Chat Assistant */}
      <ChatAssistant
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        dataset={null}
        currentStep="Home"
        language={language}
      />
    </div>
  )
}
