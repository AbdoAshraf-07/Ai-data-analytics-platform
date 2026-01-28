"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { X, Send, Bot, User, TrendingUp, Database } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatAssistantProps {
  isOpen: boolean
  onClose: () => void
  dataset?: any
  currentStep?: string
  language?: "ar" | "en"
}

export function ChatAssistant({ isOpen, onClose, dataset, currentStep, language = "en" }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const content = {
    ar: {
      title: "المساعد الذكي",
      placeholder: "اسأل عن بياناتك أو احصل على نصائح...",
      send: "إرسال",
      suggestions: "اقتراحات",
      welcomeMessage: "مرحباً! أنا مساعدك الذكي لتحليل البيانات. كيف يمكنني مساعدتك اليوم؟",
      quickActions: ["كيف أنظف بياناتي؟", "ما هي أفضل الرسوم البيانية؟", "كيف أبني نموذج تنبؤي؟", "اشرح لي النتائج"],
      dataInsights: "رؤى البيانات",
      recommendations: "التوصيات",
      helpTips: "نصائح مفيدة",
    },
    en: {
      title: "AI Assistant",
      placeholder: "Ask about your data or get tips...",
      send: "Send",
      suggestions: "Suggestions",
      welcomeMessage: "Hello! I'm your AI assistant for data analysis. How can I help you today?",
      quickActions: [
        "How do I clean my data?",
        "What are the best charts?",
        "How to build a predictive model?",
        "Explain the results",
      ],
      dataInsights: "Data Insights",
      recommendations: "Recommendations",
      helpTips: "Helpful Tips",
    },
  }

  const t = content[language]

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        type: "assistant",
        content: t.welcomeMessage,
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length, t.welcomeMessage])

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const lowerMessage = userMessage.toLowerCase()

    // Context-aware responses based on current step and dataset
    if (dataset) {
      if (lowerMessage.includes("clean") || lowerMessage.includes("تنظيف")) {
        return language === "ar"
          ? `بناءً على بياناتك التي تحتوي على ${dataset.shape[0]} صف و ${dataset.shape[1]} عمود، أنصح بالتحقق من القيم المفقودة أولاً. يمكنك استخدام أدوات التنظيف التلقائي في الخطوة التالية.`
          : `Based on your dataset with ${dataset.shape[0]} rows and ${dataset.shape[1]} columns, I recommend checking for missing values first. You can use the automatic cleaning tools in the next step.`
      }

      if (lowerMessage.includes("chart") || lowerMessage.includes("رسم")) {
        const numericCols = Object.entries(dataset.dtypes).filter(([_, type]) => type === "float64").length
        return language === "ar"
          ? `لديك ${numericCols} عمود رقمي. أنصح بالبدء برسم بياني شريطي للتوزيع، ثم رسم نقطي للارتباطات بين المتغيرات.`
          : `You have ${numericCols} numeric columns. I recommend starting with bar charts for distribution, then scatter plots for correlations between variables.`
      }

      if (lowerMessage.includes("model") || lowerMessage.includes("نموذج")) {
        return language === "ar"
          ? `بناءً على نوع بياناتك، يمكنني اقتراح نماذج التصنيف أو التنبؤ. هل تريد التنبؤ بقيمة رقمية أم تصنيف فئات؟`
          : `Based on your data type, I can suggest classification or prediction models. Do you want to predict a numeric value or classify categories?`
      }
    }

    // General responses
    if (lowerMessage.includes("hello") || lowerMessage.includes("مرحبا")) {
      return language === "ar"
        ? "مرحباً! أنا هنا لمساعدتك في تحليل البيانات. ما الذي تود معرفته؟"
        : "Hello! I'm here to help you with data analysis. What would you like to know?"
    }

    if (lowerMessage.includes("help") || lowerMessage.includes("مساعدة")) {
      return language === "ar"
        ? "يمكنني مساعدتك في: تنظيف البيانات، اختيار الرسوم البيانية المناسبة، بناء النماذج التنبؤية، وتفسير النتائج. ما الذي تحتاج إليه؟"
        : "I can help you with: data cleaning, choosing appropriate charts, building predictive models, and interpreting results. What do you need?"
    }

    // Default response
    return language === "ar"
      ? "هذا سؤال رائع! دعني أفكر في أفضل طريقة لمساعدتك. هل يمكنك تقديم المزيد من التفاصيل حول ما تريد تحقيقه؟"
      : "That's a great question! Let me think about the best way to help you. Could you provide more details about what you're trying to achieve?"
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await generateResponse(inputValue)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          language === "ar" ? "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى." : "Sorry, an error occurred. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = (action: string) => {
    setInputValue(action)
    handleSendMessage()
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
      <Card className="w-96 h-[600px] flex flex-col pointer-events-auto animate-slide-up shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <span>{t.title}</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4 p-4">
          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.suggestions}</h4>
            <div className="flex flex-wrap gap-2">
              {t.quickActions.map((action, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors text-xs"
                  onClick={() => handleQuickAction(action)}
                >
                  {action}
                </Badge>
              ))}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="space-y-4 pr-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "assistant" && (
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                      <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
                  </div>
                  {message.type === "user" && (
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                      <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.placeholder}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isTyping}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="sm"
              className="transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Context Info */}
          {dataset && (
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
              <div className="flex items-center space-x-2">
                <Database className="h-3 w-3" />
                <span>
                  {language === "ar"
                    ? `البيانات: ${dataset.shape[0]} صف، ${dataset.shape[1]} عمود`
                    : `Dataset: ${dataset.shape[0]} rows, ${dataset.shape[1]} columns`}
                </span>
              </div>
              {currentStep && (
                <div className="flex items-center space-x-2 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{language === "ar" ? `الخطوة الحالية: ${currentStep}` : `Current step: ${currentStep}`}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
