"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, BarChart3, Info, Eye, Hash, Type, Calendar, TrendingUp, AlertTriangle } from "lucide-react"

interface Dataset {
  name: string
  data: any[]
  columns: string[]
  shape: [number, number]
  dtypes: Record<string, string>
}

interface DataExplorerProps {
  dataset: Dataset
  language?: "ar" | "en"
}

export function DataExplorer({ dataset, language = "en" }: DataExplorerProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const rowsPerPage = 10

  const content = {
    ar: {
      title: "استكشاف البيانات",
      description: "عرض وفهم مجموعة البيانات الخاصة بك",
      overview: "نظرة عامة",
      dataPreview: "معاينة البيانات",
      statistics: "الإحصائيات",
      dataTypes: "أنواع البيانات",
      fileName: "اسم الملف",
      totalRows: "إجمالي الصفوف",
      totalColumns: "إجمالي الأعمدة",
      memoryUsage: "استخدام الذاكرة",
      showingRows: "عرض الصفوف",
      of: "من",
      column: "العمود",
      dataType: "نوع البيانات",
      nonNullCount: "عدد القيم غير الفارغة",
      nullCount: "عدد القيم الفارغة",
      uniqueValues: "القيم الفريدة",
      mean: "المتوسط",
      median: "الوسيط",
      mode: "المنوال",
      standardDeviation: "الانحراف المعياري",
      min: "الحد الأدنى",
      max: "الحد الأقصى",
      quartile25: "الربع الأول",
      quartile75: "الربع الثالث",
      numeric: "رقمي",
      categorical: "تصنيفي",
      datetime: "تاريخ ووقت",
      boolean: "منطقي",
      previous: "السابق",
      next: "التالي",
      dataQuality: "جودة البيانات",
      missingValues: "القيم المفقودة",
      duplicateRows: "الصفوف المكررة",
      outliers: "القيم الشاذة",
      dataHealth: "صحة البيانات",
      excellent: "ممتاز",
      good: "جيد",
      fair: "مقبول",
      poor: "ضعيف",
    },
    en: {
      title: "Data Explorer",
      description: "View and understand your dataset",
      overview: "Overview",
      dataPreview: "Data Preview",
      statistics: "Statistics",
      dataTypes: "Data Types",
      fileName: "File Name",
      totalRows: "Total Rows",
      totalColumns: "Total Columns",
      memoryUsage: "Memory Usage",
      showingRows: "Showing rows",
      of: "of",
      column: "Column",
      dataType: "Data Type",
      nonNullCount: "Non-null Count",
      nullCount: "Null Count",
      uniqueValues: "Unique Values",
      mean: "Mean",
      median: "Median",
      mode: "Mode",
      standardDeviation: "Standard Deviation",
      min: "Min",
      max: "Max",
      quartile25: "25th Percentile",
      quartile75: "75th Percentile",
      numeric: "Numeric",
      categorical: "Categorical",
      datetime: "DateTime",
      boolean: "Boolean",
      previous: "Previous",
      next: "Next",
      dataQuality: "Data Quality",
      missingValues: "Missing Values",
      duplicateRows: "Duplicate Rows",
      outliers: "Outliers",
      dataHealth: "Data Health",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      poor: "Poor",
    },
  }

  const t = content[language]

  // Calculate basic statistics
  const getColumnStats = (columnName: string) => {
    const values = dataset.data
      .map((row) => row[columnName])
      .filter((val) => val !== null && val !== undefined && val !== "")
    const nonNullCount = values.length
    const nullCount = dataset.data.length - nonNullCount
    const uniqueValues = new Set(values).size

    if (dataset.dtypes[columnName] === "float64") {
      const numericValues = values.map(Number).filter((val) => !isNaN(val))
      if (numericValues.length > 0) {
        const sorted = numericValues.sort((a, b) => a - b)
        const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length
        const median = sorted[Math.floor(sorted.length / 2)]
        const variance = numericValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericValues.length
        const stdDev = Math.sqrt(variance)

        return {
          nonNullCount,
          nullCount,
          uniqueValues,
          mean: mean.toFixed(2),
          median: median.toFixed(2),
          min: Math.min(...numericValues).toFixed(2),
          max: Math.max(...numericValues).toFixed(2),
          stdDev: stdDev.toFixed(2),
          q25: sorted[Math.floor(sorted.length * 0.25)]?.toFixed(2) || "N/A",
          q75: sorted[Math.floor(sorted.length * 0.75)]?.toFixed(2) || "N/A",
        }
      }
    }

    // For categorical data
    const valueCounts: Record<string, number> = {}
    values.forEach((val) => {
      valueCounts[val] = (valueCounts[val] || 0) + 1
    })
    const mode = Object.entries(valueCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"

    return {
      nonNullCount,
      nullCount,
      uniqueValues,
      mode,
    }
  }

  // Calculate data quality metrics
  const calculateDataQuality = () => {
    const totalCells = dataset.shape[0] * dataset.shape[1]
    let missingCells = 0

    dataset.data.forEach((row) => {
      dataset.columns.forEach((col) => {
        if (row[col] === null || row[col] === undefined || row[col] === "") {
          missingCells++
        }
      })
    })

    const missingPercentage = (missingCells / totalCells) * 100

    // Check for duplicate rows
    const uniqueRows = new Set(dataset.data.map((row) => JSON.stringify(row)))
    const duplicateRows = dataset.data.length - uniqueRows.size

    // Simple data health score
    let healthScore = 100
    healthScore -= missingPercentage
    healthScore -= (duplicateRows / dataset.data.length) * 20

    let healthLabel = t.excellent
    if (healthScore < 90) healthLabel = t.good
    if (healthScore < 70) healthLabel = t.fair
    if (healthScore < 50) healthLabel = t.poor

    return {
      missingPercentage: missingPercentage.toFixed(1),
      duplicateRows,
      healthScore: Math.max(0, healthScore).toFixed(1),
      healthLabel,
    }
  }

  const dataQuality = calculateDataQuality()
  const totalPages = Math.ceil(dataset.data.length / rowsPerPage)
  const currentData = dataset.data.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)

  const getDataTypeIcon = (dtype: string) => {
    switch (dtype) {
      case "float64":
        return <Hash className="h-4 w-4 text-blue-600" />
      case "object":
        return <Type className="h-4 w-4 text-green-600" />
      case "datetime64":
        return <Calendar className="h-4 w-4 text-purple-600" />
      case "bool":
        return <BarChart3 className="h-4 w-4 text-orange-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getDataTypeLabel = (dtype: string) => {
    switch (dtype) {
      case "float64":
        return t.numeric
      case "object":
        return t.categorical
      case "datetime64":
        return t.datetime
      case "bool":
        return t.boolean
      default:
        return dtype
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.totalRows}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dataset.shape[0].toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.totalColumns}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dataset.shape[1]}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.dataHealth}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dataQuality.healthScore}%</p>
                <Badge variant={dataQuality.healthScore > "80" ? "default" : "secondary"} className="text-xs">
                  {dataQuality.healthLabel}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.missingValues}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dataQuality.missingPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preview">{t.dataPreview}</TabsTrigger>
          <TabsTrigger value="types">{t.dataTypes}</TabsTrigger>
          <TabsTrigger value="stats">{t.statistics}</TabsTrigger>
          <TabsTrigger value="quality">{t.dataQuality}</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>{t.dataPreview}</span>
              </CardTitle>
              <CardDescription>
                {t.showingRows} {currentPage * rowsPerPage + 1}-
                {Math.min((currentPage + 1) * rowsPerPage, dataset.data.length)} {t.of} {dataset.data.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {dataset.columns.map((column) => (
                        <TableHead key={column} className="font-semibold">
                          {column}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((row, index) => (
                      <TableRow key={index}>
                        {dataset.columns.map((column) => (
                          <TableCell key={column} className="max-w-32 truncate">
                            {row[column]?.toString() || ""}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 bg-transparent"
                  >
                    {t.previous}
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 bg-transparent"
                  >
                    {t.next}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5" />
                <span>{t.dataTypes}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataset.columns.map((column) => {
                  const stats = getColumnStats(column)
                  return (
                    <div key={column} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getDataTypeIcon(dataset.dtypes[column])}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{column}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getDataTypeLabel(dataset.dtypes[column])}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {stats.nonNullCount} / {dataset.data.length}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{t.nonNullCount}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dataset.columns.map((column) => {
              const stats = getColumnStats(column)
              const isNumeric = dataset.dtypes[column] === "float64"

              return (
                <Card key={column}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      {getDataTypeIcon(dataset.dtypes[column])}
                      <span>{column}</span>
                    </CardTitle>
                    <Badge variant="outline">{getDataTypeLabel(dataset.dtypes[column])}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">{t.nonNullCount}:</span> {stats.nonNullCount}
                      </div>
                      <div>
                        <span className="font-medium">{t.nullCount}:</span> {stats.nullCount}
                      </div>
                      <div>
                        <span className="font-medium">{t.uniqueValues}:</span> {stats.uniqueValues}
                      </div>

                      {isNumeric ? (
                        <>
                          <div>
                            <span className="font-medium">{t.mean}:</span> {stats.mean}
                          </div>
                          <div>
                            <span className="font-medium">{t.median}:</span> {stats.median}
                          </div>
                          <div>
                            <span className="font-medium">{t.standardDeviation}:</span> {stats.stdDev}
                          </div>
                          <div>
                            <span className="font-medium">{t.min}:</span> {stats.min}
                          </div>
                          <div>
                            <span className="font-medium">{t.max}:</span> {stats.max}
                          </div>
                          <div>
                            <span className="font-medium">{t.quartile25}:</span> {stats.q25}
                          </div>
                          <div>
                            <span className="font-medium">{t.quartile75}:</span> {stats.q75}
                          </div>
                        </>
                      ) : (
                        <div>
                          <span className="font-medium">{t.mode}:</span> {stats.mode}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>{t.dataQuality}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {dataQuality.healthScore}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t.dataHealth}</div>
                  <Badge variant={dataQuality.healthScore > "80" ? "default" : "secondary"} className="mt-2">
                    {dataQuality.healthLabel}
                  </Badge>
                </div>

                <div className="text-center p-6 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                    {dataQuality.missingPercentage}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t.missingValues}</div>
                </div>

                <div className="text-center p-6 bg-red-50 dark:bg-red-950 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                    {dataQuality.duplicateRows}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t.duplicateRows}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
