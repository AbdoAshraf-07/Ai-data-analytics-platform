"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Upload,
  Database,
  BarChart3,
  Brain,
  Download,
  MessageCircle,
  ArrowLeft,
  Moon,
  Sun,
  Languages,
} from "lucide-react"
import { DataExplorer } from "@/components/data-explorer"
import { DataCleaning } from "@/components/data-cleaning"
import { DataPreprocessing } from "@/components/data-preprocessing"
import { MachineLearning } from "@/components/machine-learning"
import { DataVisualization } from "@/components/data-visualization"
import { ChatAssistant } from "@/components/chat-assistant"
import { ExportData } from "@/components/export-data"
import Link from "next/link"
import { useTheme } from "next-themes"

interface Dataset {
  name: string
  data: any[]
  columns: string[]
  shape: [number, number]
  dtypes: Record<string, string>
}

export default function AnalysisPage() {
  const [language, setLanguage] = useState<"ar" | "en">("en")
  const [currentStep, setCurrentStep] = useState(0)
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [processedData, setProcessedData] = useState<any[]>([])
  const [predictions, setPredictions] = useState<any[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ar" ? "en" : "ar"))
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  useEffect(() => {
    // Get dataset from sessionStorage if available
    const storedDataset = sessionStorage.getItem("uploadedDataset")
    if (storedDataset) {
      try {
        const parsedDataset = JSON.parse(storedDataset)
        setDataset(parsedDataset)
        setProcessedData(parsedDataset.data)
        setCurrentStep(0) // Start with explore step
      } catch (error) {
        console.error("Error parsing dataset from storage:", error)
      }
    }
  }, [])

  const steps = [
    {
      id: "explore",
      title: language === "ar" ? "استكشاف البيانات" : "Explore Data",
      icon: Database,
      description: language === "ar" ? "عرض وفهم مجموعة البيانات" : "View and understand your dataset",
    },
    {
      id: "clean",
      title: language === "ar" ? "تنظيف البيانات" : "Clean Data",
      icon: Database,
      description: language === "ar" ? "معالجة القيم المفقودة والمكررة" : "Handle missing values and duplicates",
    },
    {
      id: "preprocess",
      title: language === "ar" ? "معالجة البيانات" : "Preprocess",
      icon: Database,
      description: language === "ar" ? "تحويل وإعداد البيانات" : "Transform and prepare your data",
    },
    {
      id: "model",
      title: language === "ar" ? "نماذج التعلم الآلي" : "ML Models",
      icon: Brain,
      description: language === "ar" ? "تدريب وتقييم النماذج" : "Train and evaluate models",
    },
    {
      id: "visualize",
      title: language === "ar" ? "التصور" : "Visualize",
      icon: BarChart3,
      description: language === "ar" ? "إنشاء الرسوم البيانية والرؤى" : "Create charts and insights",
    },
    {
      id: "export",
      title: language === "ar" ? "التصدير" : "Export",
      icon: Download,
      description: language === "ar" ? "تنزيل النتائج" : "Download results",
    },
  ]

  const handleDataUpdate = (newData: any[]) => {
    setProcessedData(newData)
  }

  const handlePredictions = (newPredictions: any[]) => {
    setPredictions(newPredictions)
  }

  const renderCurrentStep = () => {
    if (!dataset) {
      return (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {language === "ar" ? "لا توجد بيانات للتحليل" : "No Data to Analyze"}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {language === "ar" ? "يرجى رفع ملف البيانات أولاً" : "Please upload a data file first"}
          </p>
          <Link href="/upload">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95">
              <Upload className="mr-2 h-4 w-4" />
              {language === "ar" ? "رفع البيانات" : "Upload Data"}
            </Button>
          </Link>
        </div>
      )
    }

    switch (currentStep) {
      case 0:
        return <DataExplorer dataset={dataset} language={language} />
      case 1:
        return (
          <DataCleaning
            dataset={dataset}
            processedData={processedData}
            onDataUpdate={handleDataUpdate}
            language={language}
          />
        )
      case 2:
        return (
          <DataPreprocessing
            dataset={dataset}
            processedData={processedData}
            onDataUpdate={handleDataUpdate}
            language={language}
          />
        )
      case 3:
        return (
          <MachineLearning
            dataset={dataset}
            processedData={processedData}
            onPredictions={handlePredictions}
            language={language}
          />
        )
      case 4:
        return (
          <DataVisualization
            dataset={dataset}
            processedData={processedData}
            predictions={predictions}
            language={language}
          />
        )
      case 5:
        return (
          <ExportData dataset={dataset} processedData={processedData} predictions={predictions} language={language} />
        )
      default:
        return <DataExplorer dataset={dataset} language={language} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
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
                  {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
                </Button>
              </Link>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Data Insight</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === "ar" ? "تحليل البيانات بالذكاء الاصطناعي" : "AI-Powered Data Analysis"}
                </p>
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
                {language === "ar" ? "المساعد الذكي" : "AI Assistant"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        {dataset && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{language === "ar" ? "خط تحليل البيانات" : "Analysis Pipeline"}</CardTitle>
              <CardDescription>
                {language === "ar" ? "اتبع هذه الخطوات لتحليل بياناتك" : "Follow these steps to analyze your data"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = index === currentStep
                  const isCompleted = index < currentStep

                  return (
                    <Button
                      key={step.id}
                      variant={isActive ? "default" : isCompleted ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setCurrentStep(index)}
                      className={`flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${
                        isActive ? "bg-blue-600 hover:bg-blue-700" : ""
                      } ${!isActive ? "bg-transparent" : ""}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{step.title}</span>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="space-y-6">{renderCurrentStep()}</div>

        {/* Navigation */}
        {dataset && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 bg-transparent"
            >
              {language === "ar" ? "السابق" : "Previous"}
            </Button>
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              {language === "ar" ? "التالي" : "Next"}
            </Button>
          </div>
        )}
      </div>

      {/* Chat Assistant */}
      <ChatAssistant
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        dataset={dataset}
        currentStep={steps[currentStep]?.title}
        language={language}
      />
    </div>
  )
}
