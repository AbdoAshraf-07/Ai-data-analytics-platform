"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"
import { ChatAssistant } from "@/components/chat-assistant"
import {
  BarChart3,
  ArrowLeft,
  Moon,
  Sun,
  Languages,
  MessageCircle,
  Upload,
  Database,
  FileText,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"

export default function UploadPage() {
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
      title: "رفع البيانات",
      subtitle: "ابدأ رحلة تحليل البيانات",
      description: "ارفع ملف CSV لبدء تحليل بياناتك باستخدام الذكاء الاصطناعي",
      backToHome: "العودة للرئيسية",
      aiAssistant: "المساعد الذكي",
      features: [
        {
          icon: Upload,
          title: "رفع سهل",
          description: "اسحب وأفلت ملف CSV أو انقر للاختيار",
        },
        {
          icon: Database,
          title: "معالجة تلقائية",
          description: "تحليل وتنظيف البيانات تلقائياً",
        },
        {
          icon: FileText,
          title: "دعم متعدد الصيغ",
          description: "دعم ملفات CSV حتى 10 ميجابايت",
        },
        {
          icon: Zap,
          title: "سرعة فائقة",
          description: "معالجة سريعة وفعالة للبيانات",
        },
      ],
      sampleData: "بيانات تجريبية",
      sampleDescription: "جرب المنصة باستخدام بيانات تجريبية",
      useSample: "استخدم البيانات التجريبية",
    },
    en: {
      title: "Upload Data",
      subtitle: "Start Your Data Analysis Journey",
      description: "Upload a CSV file to begin analyzing your data with AI",
      backToHome: "Back to Home",
      aiAssistant: "AI Assistant",
      features: [
        {
          icon: Upload,
          title: "Easy Upload",
          description: "Drag and drop CSV file or click to select",
        },
        {
          icon: Database,
          title: "Auto Processing",
          description: "Automatic data analysis and cleaning",
        },
        {
          icon: FileText,
          title: "Multi-format Support",
          description: "Support for CSV files up to 10MB",
        },
        {
          icon: Zap,
          title: "Lightning Fast",
          description: "Quick and efficient data processing",
        },
      ],
      sampleData: "Sample Data",
      sampleDescription: "Try the platform with sample datasets",
      useSample: "Use Sample Data",
    },
  }

  const t = content[language]

  const handleUseSampleData = () => {
    // Create sample dataset
    const sampleData = [
      { name: "Alice", age: 25, salary: 50000, department: "Engineering" },
      { name: "Bob", age: 30, salary: 60000, department: "Marketing" },
      { name: "Charlie", age: 35, salary: 70000, department: "Engineering" },
      { name: "Diana", age: 28, salary: 55000, department: "Sales" },
      { name: "Eve", age: 32, salary: 65000, department: "Marketing" },
      { name: "Frank", age: 29, salary: 58000, department: "Engineering" },
      { name: "Grace", age: 31, salary: 62000, department: "Sales" },
      { name: "Henry", age: 27, salary: 52000, department: "Marketing" },
      { name: "Ivy", age: 33, salary: 68000, department: "Engineering" },
      { name: "Jack", age: 26, salary: 51000, department: "Sales" },
    ]

    const dataset = {
      name: "sample_employee_data.csv",
      data: sampleData,
      columns: ["name", "age", "salary", "department"],
      shape: [sampleData.length, 4] as [number, number],
      dtypes: {
        name: "object",
        age: "float64",
        salary: "float64",
        department: "object",
      },
    }

    sessionStorage.setItem("uploadedDataset", JSON.stringify(dataset))
    window.location.href = "/analysis"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t.backToHome}
                </Button>
              </Link>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Data Insight</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.subtitle}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <FileUpload language={language} />
          </div>

          {/* Features & Sample Data */}
          <div className="space-y-6">
            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {t.features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                        <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{feature.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Sample Data */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.sampleData}</CardTitle>
                <CardDescription>{t.sampleDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleUseSampleData}
                  variant="outline"
                  className="w-full transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 bg-transparent"
                >
                  <Database className="h-4 w-4 mr-2" />
                  {t.useSample}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chat Assistant */}
      <ChatAssistant
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        dataset={null}
        currentStep="Upload"
        language={language}
      />
    </div>
  )
}
