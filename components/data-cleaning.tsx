"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, RefreshCw, CheckCircle, AlertTriangle, Zap, Database, Filter, Copy } from "lucide-react"

interface Dataset {
  name: string
  data: any[]
  columns: string[]
  shape: [number, number]
  dtypes: Record<string, string>
}

interface DataCleaningProps {
  dataset: Dataset
  processedData: any[]
  onDataUpdate: (data: any[]) => void
  language?: "ar" | "en"
}

export function DataCleaning({ dataset, processedData, onDataUpdate, language = "en" }: DataCleaningProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [cleaningProgress, setCleaningProgress] = useState(0)
  const [cleaningResults, setCleaningResults] = useState<any>(null)

  const content = {
    ar: {
      title: "تنظيف البيانات",
      description: "تحسين جودة البيانات عبر إزالة القيم المفقودة والمكررة",
      autoClean: "تنظيف تلقائي",
      manualClean: "تنظيف يدوي",
      results: "النتائج",
      missingValues: "القيم المفقودة",
      duplicateRows: "الصفوف المكررة",
      outliers: "القيم الشاذة",
      startCleaning: "بدء التنظيف",
      processing: "جاري المعالجة...",
      completed: "تم التنظيف بنجاح!",
      originalRows: "الصفوف الأصلية",
      cleanedRows: "الصفوف بعد التنظيف",
      removedRows: "الصفوف المحذوفة",
      fillMissing: "ملء القيم المفقودة",
      removeMissing: "حذف القيم المفقودة",
      removeDuplicates: "حذف المكررات",
      removeOutliers: "حذف القيم الشاذة",
      capOutliers: "تحديد القيم الشاذة",
      selectMethod: "اختر الطريقة",
      fillWithMean: "ملء بالمتوسط",
      fillWithMedian: "ملء بالوسيط",
      fillWithMode: "ملء بالمنوال",
      fillWithZero: "ملء بالصفر",
      applyChanges: "تطبيق التغييرات",
      resetData: "إعادة تعيين البيانات",
      column: "العمود",
      action: "الإجراء",
      apply: "تطبيق",
      cleaningComplete: "تم التنظيف",
      dataQualityImproved: "تحسنت جودة البيانات",
    },
    en: {
      title: "Data Cleaning",
      description: "Improve data quality by handling missing values and duplicates",
      autoClean: "Auto Clean",
      manualClean: "Manual Clean",
      results: "Results",
      missingValues: "Missing Values",
      duplicateRows: "Duplicate Rows",
      outliers: "Outliers",
      startCleaning: "Start Cleaning",
      processing: "Processing...",
      completed: "Cleaning completed successfully!",
      originalRows: "Original Rows",
      cleanedRows: "Cleaned Rows",
      removedRows: "Removed Rows",
      fillMissing: "Fill Missing Values",
      removeMissing: "Remove Missing Values",
      removeDuplicates: "Remove Duplicates",
      removeOutliers: "Remove Outliers",
      capOutliers: "Cap Outliers",
      selectMethod: "Select method",
      fillWithMean: "Fill with Mean",
      fillWithMedian: "Fill with Median",
      fillWithMode: "Fill with Mode",
      fillWithZero: "Fill with Zero",
      applyChanges: "Apply Changes",
      resetData: "Reset Data",
      column: "Column",
      action: "Action",
      apply: "Apply",
      cleaningComplete: "Cleaning Complete",
      dataQualityImproved: "Data quality improved",
    },
  }

  const t = content[language]

  // Calculate data quality metrics
  const calculateDataQuality = (data: any[]) => {
    const totalCells = data.length * dataset.columns.length
    let missingCells = 0

    data.forEach((row) => {
      dataset.columns.forEach((col) => {
        if (row[col] === null || row[col] === undefined || row[col] === "" || row[col] === "NaN") {
          missingCells++
        }
      })
    })

    // Check for duplicate rows
    const uniqueRows = new Set(data.map((row) => JSON.stringify(row)))
    const duplicateRows = data.length - uniqueRows.size

    // Detect outliers in numeric columns
    let outlierCount = 0
    dataset.columns.forEach((col) => {
      if (dataset.dtypes[col] === "float64") {
        const values = data.map((row) => Number.parseFloat(row[col])).filter((val) => !isNaN(val))
        if (values.length > 0) {
          const sorted = values.sort((a, b) => a - b)
          const q1 = sorted[Math.floor(sorted.length * 0.25)]
          const q3 = sorted[Math.floor(sorted.length * 0.75)]
          const iqr = q3 - q1
          const lowerBound = q1 - 1.5 * iqr
          const upperBound = q3 + 1.5 * iqr

          outlierCount += values.filter((val) => val < lowerBound || val > upperBound).length
        }
      }
    })

    return {
      missingCells,
      missingPercentage: (missingCells / totalCells) * 100,
      duplicateRows,
      outlierCount,
      totalRows: data.length,
    }
  }

  const currentQuality = calculateDataQuality(processedData)

  const handleAutoCleaning = async () => {
    setIsProcessing(true)
    setCleaningProgress(0)

    try {
      let cleanedData = [...processedData]
      const originalCount = cleanedData.length

      // Step 1: Remove duplicates (20%)
      setCleaningProgress(20)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const uniqueRows = new Map()
      cleanedData = cleanedData.filter((row) => {
        const key = JSON.stringify(row)
        if (uniqueRows.has(key)) {
          return false
        }
        uniqueRows.set(key, true)
        return true
      })

      // Step 2: Handle missing values (40%)
      setCleaningProgress(40)
      await new Promise((resolve) => setTimeout(resolve, 500))

      dataset.columns.forEach((col) => {
        if (dataset.dtypes[col] === "float64") {
          // Fill numeric columns with median
          const values = cleanedData.map((row) => Number.parseFloat(row[col])).filter((val) => !isNaN(val))
          if (values.length > 0) {
            const sorted = values.sort((a, b) => a - b)
            const median = sorted[Math.floor(sorted.length / 2)]

            cleanedData = cleanedData.map((row) => ({
              ...row,
              [col]:
                row[col] === null || row[col] === undefined || row[col] === "" || row[col] === "NaN"
                  ? median
                  : row[col],
            }))
          }
        } else {
          // Fill categorical columns with mode
          const valueCounts: Record<string, number> = {}
          cleanedData.forEach((row) => {
            const val = row[col]
            if (val !== null && val !== undefined && val !== "" && val !== "NaN") {
              valueCounts[val] = (valueCounts[val] || 0) + 1
            }
          })

          const mode = Object.entries(valueCounts).sort(([, a], [, b]) => b - a)[0]?.[0]
          if (mode) {
            cleanedData = cleanedData.map((row) => ({
              ...row,
              [col]:
                row[col] === null || row[col] === undefined || row[col] === "" || row[col] === "NaN" ? mode : row[col],
            }))
          }
        }
      })

      // Step 3: Handle outliers (60%)
      setCleaningProgress(60)
      await new Promise((resolve) => setTimeout(resolve, 500))

      dataset.columns.forEach((col) => {
        if (dataset.dtypes[col] === "float64") {
          const values = cleanedData.map((row) => Number.parseFloat(row[col])).filter((val) => !isNaN(val))
          if (values.length > 0) {
            const sorted = values.sort((a, b) => a - b)
            const q1 = sorted[Math.floor(sorted.length * 0.25)]
            const q3 = sorted[Math.floor(sorted.length * 0.75)]
            const iqr = q3 - q1
            const lowerBound = q1 - 1.5 * iqr
            const upperBound = q3 + 1.5 * iqr

            // Cap outliers instead of removing them
            cleanedData = cleanedData.map((row) => ({
              ...row,
              [col]: Math.max(lowerBound, Math.min(upperBound, Number.parseFloat(row[col]) || 0)),
            }))
          }
        }
      })

      // Step 4: Final validation (80%)
      setCleaningProgress(80)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 5: Complete (100%)
      setCleaningProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const finalCount = cleanedData.length
      const removedCount = originalCount - finalCount

      setCleaningResults({
        originalRows: originalCount,
        cleanedRows: finalCount,
        removedRows: removedCount,
        qualityBefore: calculateDataQuality(processedData),
        qualityAfter: calculateDataQuality(cleanedData),
      })

      onDataUpdate(cleanedData)
    } catch (error) {
      console.error("Error during cleaning:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemoveOutliers = () => {
    let cleanedData = [...processedData]

    dataset.columns.forEach((col) => {
      if (dataset.dtypes[col] === "float64") {
        const values = cleanedData.map((row) => Number.parseFloat(row[col])).filter((val) => !isNaN(val))
        if (values.length > 0) {
          const sorted = values.sort((a, b) => a - b)
          const q1 = sorted[Math.floor(sorted.length * 0.25)]
          const q3 = sorted[Math.floor(sorted.length * 0.75)]
          const iqr = q3 - q1
          const lowerBound = q1 - 1.5 * iqr
          const upperBound = q3 + 1.5 * iqr

          // Remove rows with outliers
          cleanedData = cleanedData.filter((row) => {
            const val = Number.parseFloat(row[col])
            return isNaN(val) || (val >= lowerBound && val <= upperBound)
          })
        }
      }
    })

    onDataUpdate(cleanedData)
  }

  const handleCapOutliers = () => {
    let cleanedData = [...processedData]

    dataset.columns.forEach((col) => {
      if (dataset.dtypes[col] === "float64") {
        const values = cleanedData.map((row) => Number.parseFloat(row[col])).filter((val) => !isNaN(val))
        if (values.length > 0) {
          const sorted = values.sort((a, b) => a - b)
          const q1 = sorted[Math.floor(sorted.length * 0.25)]
          const q3 = sorted[Math.floor(sorted.length * 0.75)]
          const iqr = q3 - q1
          const lowerBound = q1 - 1.5 * iqr
          const upperBound = q3 + 1.5 * iqr

          // Cap outliers
          cleanedData = cleanedData.map((row) => ({
            ...row,
            [col]: Math.max(lowerBound, Math.min(upperBound, Number.parseFloat(row[col]) || 0)),
          }))
        }
      }
    })

    onDataUpdate(cleanedData)
  }

  const handleRemoveDuplicates = () => {
    const uniqueRows = new Map()
    const cleanedData = processedData.filter((row) => {
      const key = JSON.stringify(row)
      if (uniqueRows.has(key)) {
        return false
      }
      uniqueRows.set(key, true)
      return true
    })

    onDataUpdate(cleanedData)
  }

  const resetData = () => {
    onDataUpdate(dataset.data)
    setCleaningResults(null)
    setCleaningProgress(0)
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.missingValues}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentQuality.missingPercentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Copy className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.duplicateRows}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentQuality.duplicateRows}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.outliers}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentQuality.outlierCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.originalRows}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentQuality.totalRows}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="auto" className="space-y-4">
        <TabsList>
          <TabsTrigger value="auto">{t.autoClean}</TabsTrigger>
          <TabsTrigger value="manual">{t.manualClean}</TabsTrigger>
          {cleaningResults && <TabsTrigger value="results">{t.results}</TabsTrigger>}
        </TabsList>

        <TabsContent value="auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>{t.autoClean}</span>
              </CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isProcessing && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t.processing}</span>
                  </div>
                  <Progress value={cleaningProgress} className="w-full" />
                </div>
              )}

              {!isProcessing && !cleaningResults && (
                <div className="text-center py-8">
                  <Button
                    onClick={handleAutoCleaning}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    {t.startCleaning}
                  </Button>
                </div>
              )}

              {cleaningResults && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">{t.completed}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.missingValues}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {dataset.columns.map((col) => {
                    const missingCount = processedData.filter(
                      (row) => row[col] === null || row[col] === undefined || row[col] === "" || row[col] === "NaN",
                    ).length

                    if (missingCount === 0) return null

                    return (
                      <div key={col} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">{col}</span>
                          <Badge variant="outline" className="ml-2">
                            {missingCount} missing
                          </Badge>
                        </div>
                        <Select>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder={t.selectMethod} />
                          </SelectTrigger>
                          <SelectContent>
                            {dataset.dtypes[col] === "float64" ? (
                              <>
                                <SelectItem value="mean">{t.fillWithMean}</SelectItem>
                                <SelectItem value="median">{t.fillWithMedian}</SelectItem>
                                <SelectItem value="zero">{t.fillWithZero}</SelectItem>
                              </>
                            ) : (
                              <SelectItem value="mode">{t.fillWithMode}</SelectItem>
                            )}
                            <SelectItem value="remove">{t.removeMissing}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.duplicateRows}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                    {currentQuality.duplicateRows}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t.duplicateRows}</div>
                  <Button
                    onClick={handleRemoveDuplicates}
                    variant="outline"
                    disabled={currentQuality.duplicateRows === 0}
                    className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 bg-transparent"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t.removeDuplicates}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.outliers}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {currentQuality.outlierCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t.outliers}</div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleRemoveOutliers}
                      variant="outline"
                      size="sm"
                      disabled={currentQuality.outlierCount === 0}
                      className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 bg-transparent"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t.removeOutliers}
                    </Button>
                    <Button
                      onClick={handleCapOutliers}
                      variant="outline"
                      size="sm"
                      disabled={currentQuality.outlierCount === 0}
                      className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 bg-transparent"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      {t.capOutliers}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={resetData}
                  variant="outline"
                  className="w-full transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 bg-transparent"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t.resetData}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {cleaningResults && (
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>{t.cleaningComplete}</span>
                </CardTitle>
                <CardDescription>{t.dataQualityImproved}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {cleaningResults.originalRows}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t.originalRows}</div>
                  </div>

                  <div className="text-center p-6 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {cleaningResults.cleanedRows}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t.cleanedRows}</div>
                  </div>

                  <div className="text-center p-6 bg-red-50 dark:bg-red-950 rounded-lg">
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                      {cleaningResults.removedRows}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t.removedRows}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
