"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, AlertCircle, CheckCircle, X } from "lucide-react"
import Papa from "papaparse"
import { useRouter } from "next/navigation"

interface FileUploadProps {
  language?: "ar" | "en"
}

export function FileUpload({ language = "en" }: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const content = {
    ar: {
      title: "رفع ملف البيانات",
      description: "ارفع ملف CSV لبدء تحليل البيانات",
      dragDrop: "اسحب وأفلت ملف CSV هنا، أو انقر للاختيار",
      supportedFormats: "الصيغ المدعومة: CSV (حتى 10 ميجابايت)",
      uploading: "جاري الرفع...",
      processing: "جاري معالجة البيانات...",
      success: "تم رفع الملف بنجاح!",
      error: "حدث خطأ أثناء رفع الملف",
      invalidFormat: "صيغة الملف غير مدعومة. يرجى رفع ملف CSV",
      fileTooLarge: "حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت",
      startAnalysis: "بدء التحليل",
      uploadAnother: "رفع ملف آخر",
      fileName: "اسم الملف",
      fileSize: "حجم الملف",
      rows: "صف",
      columns: "عمود",
    },
    en: {
      title: "Upload Data File",
      description: "Upload a CSV file to start analyzing your data",
      dragDrop: "Drag and drop a CSV file here, or click to select",
      supportedFormats: "Supported formats: CSV (up to 10MB)",
      uploading: "Uploading...",
      processing: "Processing data...",
      success: "File uploaded successfully!",
      error: "Error uploading file",
      invalidFormat: "Invalid file format. Please upload a CSV file",
      fileTooLarge: "File too large. Maximum size is 10MB",
      startAnalysis: "Start Analysis",
      uploadAnother: "Upload Another File",
      fileName: "File Name",
      fileSize: "File Size",
      rows: "rows",
      columns: "columns",
    },
  }

  const t = content[language]

  const processFile = useCallback(
    async (file: File) => {
      setIsUploading(true)
      setError(null)
      setUploadProgress(0)

      try {
        // Validate file type
        if (!file.name.toLowerCase().endsWith(".csv")) {
          throw new Error(t.invalidFormat)
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(t.fileTooLarge)
        }

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 200)

        // Parse CSV file
        const text = await file.text()
        const result = await new Promise<Papa.ParseResult<any>>((resolve, reject) => {
          Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: resolve,
            error: reject,
          })
        })

        clearInterval(progressInterval)
        setUploadProgress(100)

        if (result.errors.length > 0) {
          throw new Error("Error parsing CSV file")
        }

        // Process the data
        const data = result.data
        const columns = Object.keys(data[0] || {})

        // Detect column types
        const dtypes: Record<string, string> = {}
        columns.forEach((col) => {
          const sample = data.slice(0, 100).map((row) => row[col])
          const numericCount = sample.filter((val) => !isNaN(Number(val)) && val !== "").length
          dtypes[col] = numericCount > sample.length * 0.7 ? "float64" : "object"
        })

        const dataset = {
          name: file.name,
          data: data,
          columns: columns,
          shape: [data.length, columns.length] as [number, number],
          dtypes: dtypes,
        }

        // Store in sessionStorage for the analysis page
        sessionStorage.setItem("uploadedDataset", JSON.stringify(dataset))

        setUploadedFile(file)
        setSuccess(true)

        // Auto-redirect after 2 seconds
        setTimeout(() => {
          router.push("/analysis")
        }, 2000)
      } catch (err) {
        setError(err instanceof Error ? err.message : t.error)
        setUploadProgress(0)
      } finally {
        setIsUploading(false)
      }
    },
    [t, router],
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        processFile(acceptedFiles[0])
      }
    },
    [processFile],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
    disabled: isUploading,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const resetUpload = () => {
    setUploadedFile(null)
    setSuccess(false)
    setError(null)
    setUploadProgress(0)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>{t.title}</span>
        </CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!success && !uploadedFile && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t.dragDrop}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.supportedFormats}</p>
          </div>
        )}

        {isUploading && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="loading-spinner" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {uploadProgress < 90 ? t.uploading : t.processing}
              </span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && uploadedFile && (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">{t.success}</AlertDescription>
            </Alert>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">{uploadedFile.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={resetUpload}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-medium">{t.fileSize}:</span> {formatFileSize(uploadedFile.size)}
                </div>
                <div>
                  <span className="font-medium">{t.fileName}:</span> {uploadedFile.name}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => router.push("/analysis")}
                className="flex-1 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                {t.startAnalysis}
              </Button>
              <Button
                variant="outline"
                onClick={resetUpload}
                className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 bg-transparent"
              >
                {t.uploadAnother}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
