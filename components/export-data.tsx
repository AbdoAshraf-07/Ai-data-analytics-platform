"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, FileText, Database, BarChart3, CheckCircle, Package, Share2, Cloud } from "lucide-react"

interface Dataset {
  name: string
  data: any[]
  columns: string[]
  shape: [number, number]
  dtypes: Record<string, string>
}

interface ExportDataProps {
  dataset: Dataset
  processedData: any[]
  predictions?: any[]
  language?: "ar" | "en"
}

export function ExportData({ dataset, processedData, predictions = [], language = "en" }: ExportDataProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>("csv")
  const [selectedData, setSelectedData] = useState<string[]>(["processed"])
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  const content = {
    ar: {
      title: "تصدير البيانات",
      description: "تنزيل النتائج والتقارير بصيغ مختلفة",
      dataExport: "تصدير البيانات",
      reportExport: "تصدير التقارير",
      sharing: "المشاركة",
      selectFormat: "اختر الصيغة",
      selectData: "اختر البيانات للتصدير",
      originalData: "البيانات الأصلية",
      processedData: "البيانات المعالجة",
      predictions: "التنبؤات",
      modelResults: "نتائج النموذج",
      exportData: "تصدير البيانات",
      exporting: "جاري التصدير...",
      exportComplete: "تم التصدير بنجاح!",
      downloadReport: "تنزيل التقرير",
      shareResults: "مشاركة النتائج",
      csvFormat: "ملف CSV",
      jsonFormat: "ملف JSON",
      excelFormat: "ملف Excel",
      pdfReport: "تقرير PDF",
      htmlReport: "تقرير HTML",
      summary: "الملخص",
      dataOverview: "نظرة عامة على البيانات",
      processingSteps: "خطوات المعالجة",
      modelPerformance: "أداء النموذج",
      visualizations: "التصورات",
      recommendations: "التوصيات",
      exportOptions: "خيارات التصدير",
      includeCharts: "تضمين الرسوم البيانية",
      includeStatistics: "تضمين الإحصائيات",
      includeMetadata: "تضمين البيانات الوصفية",
      fileSize: "حجم الملف",
      estimatedSize: "الحجم المقدر",
      downloadReady: "جاهز للتنزيل",
    },
    en: {
      title: "Export Data",
      description: "Download results and reports in various formats",
      dataExport: "Data Export",
      reportExport: "Report Export",
      sharing: "Sharing",
      selectFormat: "Select Format",
      selectData: "Select Data to Export",
      originalData: "Original Data",
      processedData: "Processed Data",
      predictions: "Predictions",
      modelResults: "Model Results",
      exportData: "Export Data",
      exporting: "Exporting...",
      exportComplete: "Export completed successfully!",
      downloadReport: "Download Report",
      shareResults: "Share Results",
      csvFormat: "CSV File",
      jsonFormat: "JSON File",
      excelFormat: "Excel File",
      pdfReport: "PDF Report",
      htmlReport: "HTML Report",
      summary: "Summary",
      dataOverview: "Data Overview",
      processingSteps: "Processing Steps",
      modelPerformance: "Model Performance",
      visualizations: "Visualizations",
      recommendations: "Recommendations",
      exportOptions: "Export Options",
      includeCharts: "Include Charts",
      includeStatistics: "Include Statistics",
      includeMetadata: "Include Metadata",
      fileSize: "File Size",
      estimatedSize: "Estimated Size",
      downloadReady: "Ready to Download",
    },
  }

  const t = content[language]

  // Export format options
  const formatOptions = [
    { value: "csv", label: t.csvFormat, icon: FileText, size: "~2MB" },
    { value: "json", label: t.jsonFormat, icon: Database, size: "~3MB" },
    { value: "excel", label: t.excelFormat, icon: Package, size: "~4MB" },
    { value: "pdf", label: t.pdfReport, icon: FileText, size: "~5MB" },
    { value: "html", label: t.htmlReport, icon: BarChart3, size: "~3MB" },
  ]

  // Data selection options
  const dataOptions = [
    { value: "original", label: t.originalData, count: dataset.data.length },
    { value: "processed", label: t.processedData, count: processedData.length },
    { value: "predictions", label: t.predictions, count: predictions.length, disabled: predictions.length === 0 },
  ]

  const handleExport = async () => {
    setIsExporting(true)
    setExportComplete(false)

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create export data based on selections
      let exportData: any[] = []

      if (selectedData.includes("original")) {
        exportData = [...exportData, ...dataset.data]
      }
      if (selectedData.includes("processed")) {
        exportData = [...exportData, ...processedData]
      }
      if (selectedData.includes("predictions") && predictions.length > 0) {
        exportData = [...exportData, ...predictions]
      }

      // Generate file based on format
      let content = ""
      let filename = ""
      let mimeType = ""

      switch (selectedFormat) {
        case "csv":
          content = convertToCSV(exportData)
          filename = "data_export.csv"
          mimeType = "text/csv"
          break
        case "json":
          content = JSON.stringify(exportData, null, 2)
          filename = "data_export.json"
          mimeType = "application/json"
          break
        case "excel":
          // For demo purposes, export as CSV
          content = convertToCSV(exportData)
          filename = "data_export.xlsx"
          mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          break
        default:
          content = convertToCSV(exportData)
          filename = "data_export.csv"
          mimeType = "text/csv"
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setExportComplete(true)
    } catch (error) {
      console.error("Export error:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return ""

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    return csvContent
  }

  const generateReport = () => {
    const reportContent = `
# Data Analysis Report

## ${t.dataOverview}
- Total Records: ${processedData.length}
- Features: ${Object.keys(processedData[0] || {}).length}
- Original Dataset: ${dataset.name}

## ${t.processingSteps}
1. Data cleaning and preprocessing
2. Feature engineering
3. Model training and evaluation
4. Visualization and insights

## ${t.summary}
The analysis has been completed successfully with high-quality results.
Data quality has been improved and predictive models show good performance.

## ${t.recommendations}
- Continue monitoring data quality
- Consider additional feature engineering
- Implement model in production environment
- Regular model retraining recommended
    `

    const blob = new Blob([reportContent], { type: "text/markdown" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "analysis_report.md"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.originalData}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dataset.data.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.processedData}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{processedData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.predictions}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{predictions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.exportOptions}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatOptions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="data" className="space-y-4">
        <TabsList>
          <TabsTrigger value="data">{t.dataExport}</TabsTrigger>
          <TabsTrigger value="report">{t.reportExport}</TabsTrigger>
          <TabsTrigger value="share">{t.sharing}</TabsTrigger>
        </TabsList>

        <TabsContent value="data">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>{t.exportOptions}</CardTitle>
                <CardDescription>Configure your data export settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Format Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block">{t.selectFormat}</label>
                  <div className="grid grid-cols-1 gap-2">
                    {formatOptions.map((format) => {
                      const Icon = format.icon
                      return (
                        <div
                          key={format.value}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md ${
                            selectedFormat === format.value
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                          onClick={() => setSelectedFormat(format.value)}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{format.label}</span>
                          </div>
                          <Badge variant="outline">{format.size}</Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Data Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block">{t.selectData}</label>
                  <div className="space-y-2">
                    {dataOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3">
                        <Checkbox
                          id={option.value}
                          checked={selectedData.includes(option.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedData([...selectedData, option.value])
                            } else {
                              setSelectedData(selectedData.filter((item) => item !== option.value))
                            }
                          }}
                          disabled={option.disabled}
                        />
                        <label
                          htmlFor={option.value}
                          className={`text-sm ${option.disabled ? "text-gray-400" : "text-gray-700 dark:text-gray-300"}`}
                        >
                          {option.label} ({option.count} records)
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Export Button */}
                <Button
                  onClick={handleExport}
                  disabled={isExporting || selectedData.length === 0}
                  className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                >
                  {isExporting ? (
                    <>
                      <Download className="mr-2 h-4 w-4 animate-pulse" />
                      {t.exporting}
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      {t.exportData}
                    </>
                  )}
                </Button>

                {exportComplete && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      {t.exportComplete}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Export Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Export Preview</CardTitle>
                <CardDescription>Preview of your export configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium">Format:</span>
                    <Badge>{formatOptions.find((f) => f.value === selectedFormat)?.label}</Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium">Data Sources:</span>
                    <span className="text-sm">{selectedData.length} selected</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium">{t.estimatedSize}:</span>
                    <span className="text-sm">{formatOptions.find((f) => f.value === selectedFormat)?.size}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium">Total Records:</span>
                    <span className="text-sm">
                      {selectedData.reduce((total, dataType) => {
                        const option = dataOptions.find((o) => o.value === dataType)
                        return total + (option?.count || 0)
                      }, 0)}
                    </span>
                  </div>
                </div>

                {selectedData.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Selected Data:</h4>
                    <ul className="space-y-1">
                      {selectedData.map((dataType) => {
                        const option = dataOptions.find((o) => o.value === dataType)
                        return (
                          <li key={dataType} className="text-sm text-blue-800 dark:text-blue-200">
                            • {option?.label} ({option?.count} records)
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="report">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>{t.reportExport}</span>
              </CardTitle>
              <CardDescription>Generate comprehensive analysis reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Report Contents:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{t.dataOverview}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{t.processingSteps}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{t.modelPerformance}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{t.visualizations}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{t.recommendations}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Report Options:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="charts" defaultChecked />
                      <label htmlFor="charts" className="text-sm">
                        {t.includeCharts}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="stats" defaultChecked />
                      <label htmlFor="stats" className="text-sm">
                        {t.includeStatistics}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="metadata" defaultChecked />
                      <label htmlFor="metadata" className="text-sm">
                        {t.includeMetadata}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={generateReport}
                  className="transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {t.downloadReport}
                </Button>
                <Button
                  variant="outline"
                  className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 bg-transparent"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate HTML Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Share2 className="h-5 w-5" />
                <span>{t.sharing}</span>
              </CardTitle>
              <CardDescription>Share your analysis results with others</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Cloud className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold mb-2">Cloud Storage</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Save to cloud storage services</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 bg-transparent"
                  >
                    Connect
                  </Button>
                </Card>

                <Card className="p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Share2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold mb-2">Direct Link</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Generate shareable link</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 bg-transparent"
                  >
                    Generate
                  </Button>
                </Card>

                <Card className="p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-semibold mb-2">Email Report</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Send via email</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 bg-transparent"
                  >
                    Send
                  </Button>
                </Card>
              </div>

              <Alert>
                <Share2 className="h-4 w-4" />
                <AlertDescription>
                  Sharing features are available in the premium version. Upgrade to unlock advanced sharing options.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
