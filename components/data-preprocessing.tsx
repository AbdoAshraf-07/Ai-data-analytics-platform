"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Zap, CheckCircle, BarChart3, Hash, Type, RefreshCw } from "lucide-react"

interface Dataset {
  name: string
  data: any[]
  columns: string[]
  shape: [number, number]
  dtypes: Record<string, string>
}

interface DataPreprocessingProps {
  dataset: Dataset
  processedData: any[]
  onDataUpdate: (data: any[]) => void
  language?: "ar" | "en"
}

export function DataPreprocessing({ dataset, processedData, onDataUpdate, language = "en" }: DataPreprocessingProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [encodingMethods, setEncodingMethods] = useState<Record<string, string>>({})
  const [scalingMethod, setScalingMethod] = useState<string>("standard")
  const [preprocessingResults, setPreprocessingResults] = useState<any>(null)

  const content = {
    ar: {
      title: "معالجة البيانات",
      description: "تحويل وإعداد البيانات للتحليل والنمذجة",
      autoPreprocess: "معالجة تلقائية",
      manualPreprocess: "معالجة يدوية",
      results: "النتائج",
      featureEngineering: "هندسة الميزات",
      encoding: "التشفير",
      scaling: "التطبيع",
      startProcessing: "بدء المعالجة",
      processing: "جاري المعالجة...",
      completed: "تمت المعالجة بنجاح!",
      selectColumns: "اختر الأعمدة",
      encodingMethod: "طريقة التشفير",
      scalingMethod: "طريقة التطبيع",
      oneHotEncoding: "تشفير One-Hot",
      labelEncoding: "تشفير التسميات",
      standardScaling: "تطبيع معياري",
      minMaxScaling: "تطبيع Min-Max",
      robustScaling: "تطبيع قوي",
      noScaling: "بدون تطبيع",
      applyChanges: "تطبيق التغييرات",
      resetData: "إعادة تعيين البيانات",
      column: "العمود",
      dataType: "نوع البيانات",
      action: "الإجراء",
      originalColumns: "الأعمدة الأصلية",
      processedColumns: "الأعمدة بعد المعالجة",
      newFeatures: "الميزات الجديدة",
      preprocessingComplete: "تمت المعالجة",
      dataTransformed: "تم تحويل البيانات بنجاح",
      categoricalColumns: "الأعمدة التصنيفية",
      numericColumns: "الأعمدة الرقمية",
    },
    en: {
      title: "Data Preprocessing",
      description: "Transform and prepare your data for analysis and modeling",
      autoPreprocess: "Auto Preprocess",
      manualPreprocess: "Manual Preprocess",
      results: "Results",
      featureEngineering: "Feature Engineering",
      encoding: "Encoding",
      scaling: "Scaling",
      startProcessing: "Start Processing",
      processing: "Processing...",
      completed: "Preprocessing completed successfully!",
      selectColumns: "Select Columns",
      encodingMethod: "Encoding Method",
      scalingMethod: "Scaling Method",
      oneHotEncoding: "One-Hot Encoding",
      labelEncoding: "Label Encoding",
      standardScaling: "Standard Scaling",
      minMaxScaling: "Min-Max Scaling",
      robustScaling: "Robust Scaling",
      noScaling: "No Scaling",
      applyChanges: "Apply Changes",
      resetData: "Reset Data",
      column: "Column",
      dataType: "Data Type",
      action: "Action",
      originalColumns: "Original Columns",
      processedColumns: "Processed Columns",
      newFeatures: "New Features",
      preprocessingComplete: "Preprocessing Complete",
      dataTransformed: "Data successfully transformed",
      categoricalColumns: "Categorical Columns",
      numericColumns: "Numeric Columns",
    },
  }

  const t = content[language]

  // Get categorical and numeric columns
  const categoricalColumns = dataset.columns.filter((col) => dataset.dtypes[col] === "object")
  const numericColumns = dataset.columns.filter((col) => dataset.dtypes[col] === "float64")

  const handleAutoPreprocessing = async () => {
    setIsProcessing(true)
    setProcessingProgress(0)

    try {
      let processedDataCopy = [...processedData]
      const originalColumnCount = dataset.columns.length

      // Step 1: Encode categorical variables (25%)
      setProcessingProgress(25)
      await new Promise((resolve) => setTimeout(resolve, 500))

      categoricalColumns.forEach((col) => {
        const uniqueValues = [...new Set(processedDataCopy.map((row) => row[col]))]

        if (uniqueValues.length <= 10) {
          // One-hot encoding for low cardinality
          uniqueValues.forEach((value) => {
            const newColName = `${col}_${value}`
            processedDataCopy = processedDataCopy.map((row) => ({
              ...row,
              [newColName]: row[col] === value ? 1 : 0,
            }))
          })
          // Remove original column
          processedDataCopy = processedDataCopy.map((row) => {
            const { [col]: removed, ...rest } = row
            return rest
          })
        } else {
          // Label encoding for high cardinality
          const labelMap: Record<string, number> = {}
          uniqueValues.forEach((value, index) => {
            labelMap[value] = index
          })

          processedDataCopy = processedDataCopy.map((row) => ({
            ...row,
            [col]: labelMap[row[col]] || 0,
          }))
        }
      })

      // Step 2: Scale numeric features (50%)
      setProcessingProgress(50)
      await new Promise((resolve) => setTimeout(resolve, 500))

      numericColumns.forEach((col) => {
        const values = processedDataCopy.map((row) => Number.parseFloat(row[col])).filter((val) => !isNaN(val))
        if (values.length > 0) {
          const mean = values.reduce((a, b) => a + b, 0) / values.length
          const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
          const stdDev = Math.sqrt(variance)

          if (stdDev > 0) {
            processedDataCopy = processedDataCopy.map((row) => ({
              ...row,
              [col]: (Number.parseFloat(row[col]) - mean) / stdDev,
            }))
          }
        }
      })

      // Step 3: Feature engineering (75%)
      setProcessingProgress(75)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Create interaction features for numeric columns
      if (numericColumns.length >= 2) {
        for (let i = 0; i < Math.min(numericColumns.length, 3); i++) {
          for (let j = i + 1; j < Math.min(numericColumns.length, 3); j++) {
            const col1 = numericColumns[i]
            const col2 = numericColumns[j]
            const newColName = `${col1}_x_${col2}`

            processedDataCopy = processedDataCopy.map((row) => ({
              ...row,
              [newColName]: (Number.parseFloat(row[col1]) || 0) * (Number.parseFloat(row[col2]) || 0),
            }))
          }
        }
      }

      // Step 4: Complete (100%)
      setProcessingProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const finalColumnCount = Object.keys(processedDataCopy[0] || {}).length
      const newFeatures = finalColumnCount - originalColumnCount

      setPreprocessingResults({
        originalColumns: originalColumnCount,
        processedColumns: finalColumnCount,
        newFeatures: Math.max(0, newFeatures),
        encodedColumns: categoricalColumns.length,
        scaledColumns: numericColumns.length,
      })

      onDataUpdate(processedDataCopy)
    } catch (error) {
      console.error("Error during preprocessing:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleManualEncoding = (column: string, method: string) => {
    let processedDataCopy = [...processedData]

    if (method === "onehot") {
      const uniqueValues = [...new Set(processedDataCopy.map((row) => row[column]))]

      uniqueValues.forEach((value) => {
        const newColName = `${column}_${value}`
        processedDataCopy = processedDataCopy.map((row) => ({
          ...row,
          [newColName]: row[column] === value ? 1 : 0,
        }))
      })

      // Remove original column
      processedDataCopy = processedDataCopy.map((row) => {
        const { [column]: removed, ...rest } = row
        return rest
      })
    } else if (method === "label") {
      const uniqueValues = [...new Set(processedDataCopy.map((row) => row[column]))]
      const labelMap: Record<string, number> = {}
      uniqueValues.forEach((value, index) => {
        labelMap[value] = index
      })

      processedDataCopy = processedDataCopy.map((row) => ({
        ...row,
        [column]: labelMap[row[column]] || 0,
      }))
    }

    onDataUpdate(processedDataCopy)
  }

  const handleScaling = (method: string) => {
    let processedDataCopy = [...processedData]

    numericColumns.forEach((col) => {
      const values = processedDataCopy.map((row) => Number.parseFloat(row[col])).filter((val) => !isNaN(val))
      if (values.length > 0) {
        if (method === "standard") {
          const mean = values.reduce((a, b) => a + b, 0) / values.length
          const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
          const stdDev = Math.sqrt(variance)

          if (stdDev > 0) {
            processedDataCopy = processedDataCopy.map((row) => ({
              ...row,
              [col]: (Number.parseFloat(row[col]) - mean) / stdDev,
            }))
          }
        } else if (method === "minmax") {
          const min = Math.min(...values)
          const max = Math.max(...values)

          if (max > min) {
            processedDataCopy = processedDataCopy.map((row) => ({
              ...row,
              [col]: (Number.parseFloat(row[col]) - min) / (max - min),
            }))
          }
        } else if (method === "robust") {
          const sorted = values.sort((a, b) => a - b)
          const q1 = sorted[Math.floor(sorted.length * 0.25)]
          const q3 = sorted[Math.floor(sorted.length * 0.75)]
          const iqr = q3 - q1
          const median = sorted[Math.floor(sorted.length / 2)]

          if (iqr > 0) {
            processedDataCopy = processedDataCopy.map((row) => ({
              ...row,
              [col]: (Number.parseFloat(row[col]) - median) / iqr,
            }))
          }
        }
      }
    })

    onDataUpdate(processedDataCopy)
  }

  const resetData = () => {
    onDataUpdate(dataset.data)
    setPreprocessingResults(null)
    setProcessingProgress(0)
    setSelectedColumns([])
    setEncodingMethods({})
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Type className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.categoricalColumns}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{categoricalColumns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Hash className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.numericColumns}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{numericColumns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.originalColumns}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dataset.columns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.processedColumns}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Object.keys(processedData[0] || {}).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="auto" className="space-y-4">
        <TabsList>
          <TabsTrigger value="auto">{t.autoPreprocess}</TabsTrigger>
          <TabsTrigger value="manual">{t.manualPreprocess}</TabsTrigger>
          {preprocessingResults && <TabsTrigger value="results">{t.results}</TabsTrigger>}
        </TabsList>

        <TabsContent value="auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>{t.autoPreprocess}</span>
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
                  <Progress value={processingProgress} className="w-full" />
                </div>
              )}

              {!isProcessing && !preprocessingResults && (
                <div className="text-center py-8">
                  <Button
                    onClick={handleAutoPreprocessing}
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    {t.startProcessing}
                  </Button>
                </div>
              )}

              {preprocessingResults && (
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
            {/* Encoding */}
            <Card>
              <CardHeader>
                <CardTitle>{t.encoding}</CardTitle>
                <CardDescription>Transform categorical variables into numeric format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoricalColumns.map((col) => (
                  <div key={col} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{col}</span>
                      <Badge variant="outline" className="ml-2">
                        <Type className="h-3 w-3 mr-1" />
                        Categorical
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleManualEncoding(col, "onehot")}
                        variant="outline"
                        size="sm"
                        className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 bg-transparent"
                      >
                        One-Hot
                      </Button>
                      <Button
                        onClick={() => handleManualEncoding(col, "label")}
                        variant="outline"
                        size="sm"
                        className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 bg-transparent"
                      >
                        Label
                      </Button>
                    </div>
                  </div>
                ))}
                {categoricalColumns.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No categorical columns found</p>
                )}
              </CardContent>
            </Card>

            {/* Scaling */}
            <Card>
              <CardHeader>
                <CardTitle>{t.scaling}</CardTitle>
                <CardDescription>Normalize numeric features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Select value={scalingMethod} onValueChange={setScalingMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.scalingMethod} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">{t.standardScaling}</SelectItem>
                      <SelectItem value="minmax">{t.minMaxScaling}</SelectItem>
                      <SelectItem value="robust">{t.robustScaling}</SelectItem>
                      <SelectItem value="none">{t.noScaling}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={() => handleScaling(scalingMethod)}
                    disabled={scalingMethod === "none" || numericColumns.length === 0}
                    className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    Apply Scaling
                  </Button>
                </div>

                <div className="space-y-2">
                  {numericColumns.map((col) => (
                    <div key={col} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{col}</span>
                      </div>
                      <Badge variant="outline">Numeric</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
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

        {preprocessingResults && (
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>{t.preprocessingComplete}</span>
                </CardTitle>
                <CardDescription>{t.dataTransformed}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {preprocessingResults.originalColumns}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t.originalColumns}</div>
                  </div>

                  <div className="text-center p-6 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {preprocessingResults.processedColumns}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t.processedColumns}</div>
                  </div>

                  <div className="text-center p-6 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {preprocessingResults.newFeatures}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t.newFeatures}</div>
                  </div>

                  <div className="text-center p-6 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                      {preprocessingResults.encodedColumns}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Encoded Columns</div>
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
