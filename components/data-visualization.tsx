"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Area,
  AreaChart,
  Scatter, // Scatter variable is declared here
} from "recharts"
import { BarChart3, PieChartIcon, TrendingUp, ScatterChartIcon, Download, Eye } from "lucide-react"

interface Dataset {
  name: string
  data: any[]
  columns: string[]
  shape: [number, number]
  dtypes: Record<string, string>
}

interface DataVisualizationProps {
  dataset: Dataset
  processedData: any[]
  predictions?: any[]
  language?: "ar" | "en"
}

export function DataVisualization({
  dataset,
  processedData,
  predictions = [],
  language = "en",
}: DataVisualizationProps) {
  const [selectedChart, setSelectedChart] = useState<string>("bar")
  const [selectedXAxis, setSelectedXAxis] = useState<string>("")
  const [selectedYAxis, setSelectedYAxis] = useState<string>("")

  const content = {
    ar: {
      title: "تصور البيانات",
      description: "إنشاء رسوم بيانية تفاعلية لاستكشاف البيانات",
      chartTypes: "أنواع الرسوم البيانية",
      customCharts: "رسوم بيانية مخصصة",
      insights: "الرؤى",
      export: "تصدير",
      barChart: "رسم بياني شريطي",
      lineChart: "رسم بياني خطي",
      pieChart: "رسم بياني دائري",
      scatterPlot: "رسم نقطي",
      areaChart: "رسم بياني مساحي",
      selectXAxis: "اختر المحور السيني",
      selectYAxis: "اختر المحور الصادي",
      generateChart: "إنشاء الرسم البياني",
      downloadChart: "تنزيل الرسم البياني",
      dataDistribution: "توزيع البيانات",
      correlationMatrix: "مصفوفة الارتباط",
      trendAnalysis: "تحليل الاتجاه",
      keyInsights: "الرؤى الرئيسية",
      insight1: "توزيع البيانات يظهر نمطاً طبيعياً",
      insight2: "هناك ارتباط قوي بين المتغيرات الرقمية",
      insight3: "القيم الشاذة قليلة ومحدودة",
      insight4: "البيانات مناسبة للنمذجة التنبؤية",
      chartGenerated: "تم إنشاء الرسم البياني",
      selectBothAxes: "يرجى اختيار كلا المحورين",
      noData: "لا توجد بيانات للعرض",
    },
    en: {
      title: "Data Visualization",
      description: "Create interactive charts to explore your data",
      chartTypes: "Chart Types",
      customCharts: "Custom Charts",
      insights: "Insights",
      export: "Export",
      barChart: "Bar Chart",
      lineChart: "Line Chart",
      pieChart: "Pie Chart",
      scatterPlot: "Scatter Plot",
      areaChart: "Area Chart",
      selectXAxis: "Select X-Axis",
      selectYAxis: "Select Y-Axis",
      generateChart: "Generate Chart",
      downloadChart: "Download Chart",
      dataDistribution: "Data Distribution",
      correlationMatrix: "Correlation Matrix",
      trendAnalysis: "Trend Analysis",
      keyInsights: "Key Insights",
      insight1: "Data distribution shows a normal pattern",
      insight2: "Strong correlation exists between numeric variables",
      insight3: "Outliers are minimal and contained",
      insight4: "Data is suitable for predictive modeling",
      chartGenerated: "Chart Generated",
      selectBothAxes: "Please select both axes",
      noData: "No data to display",
    },
  }

  const t = content[language]

  // Get available columns
  const availableColumns = Object.keys(processedData[0] || {})
  const numericColumns = availableColumns.filter((col) => {
    const values = processedData.map((row) => row[col])
    return values.every((val) => !isNaN(Number.parseFloat(val)))
  })

  // Chart type options
  const chartTypes = [
    { value: "bar", label: t.barChart, icon: BarChart3 },
    { value: "line", label: t.lineChart, icon: TrendingUp },
    { value: "pie", label: t.pieChart, icon: PieChartIcon },
    { value: "scatter", label: t.scatterPlot, icon: ScatterChartIcon },
    { value: "area", label: t.areaChart, icon: BarChart3 },
  ]

  // Colors for charts
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00", "#ff00ff", "#00ffff", "#ff0000"]

  // Prepare data for different chart types
  const prepareChartData = () => {
    if (!selectedXAxis || !selectedYAxis) return []

    return processedData.slice(0, 20).map((row, index) => ({
      name: row[selectedXAxis] || `Item ${index + 1}`,
      value: Number.parseFloat(row[selectedYAxis]) || 0,
      x: Number.parseFloat(row[selectedXAxis]) || index,
      y: Number.parseFloat(row[selectedYAxis]) || 0,
    }))
  }

  // Prepare data for automatic charts
  const prepareDistributionData = () => {
    if (numericColumns.length === 0) return []

    const firstNumericCol = numericColumns[0]
    const values = processedData.map((row) => Number.parseFloat(row[firstNumericCol])).filter((val) => !isNaN(val))

    // Create histogram bins
    const min = Math.min(...values)
    const max = Math.max(...values)
    const binCount = 10
    const binSize = (max - min) / binCount

    const bins = Array.from({ length: binCount }, (_, i) => ({
      range: `${(min + i * binSize).toFixed(1)}-${(min + (i + 1) * binSize).toFixed(1)}`,
      count: 0,
    }))

    values.forEach((value) => {
      const binIndex = Math.min(Math.floor((value - min) / binSize), binCount - 1)
      bins[binIndex].count++
    })

    return bins
  }

  const prepareTrendData = () => {
    if (numericColumns.length < 2) return []

    return processedData.slice(0, 20).map((row, index) => ({
      index: index + 1,
      [numericColumns[0]]: Number.parseFloat(row[numericColumns[0]]) || 0,
      [numericColumns[1]]: Number.parseFloat(row[numericColumns[1]]) || 0,
    }))
  }

  const prepareCorrelationData = () => {
    if (numericColumns.length < 2) return []

    return processedData.slice(0, 50).map((row, index) => ({
      x: Number.parseFloat(row[numericColumns[0]]) || 0,
      y: Number.parseFloat(row[numericColumns[1]]) || 0,
      name: `Point ${index + 1}`,
    }))
  }

  const renderChart = () => {
    const data = prepareChartData()

    if (data.length === 0) {
      return <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">{t.noData}</div>
    }

    switch (selectedChart) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )

      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.slice(0, 8)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.slice(0, 8).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )

      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={data}>
              <CartesianGrid />
              <XAxis dataKey="x" />
              <YAxis dataKey="y" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter dataKey="y" fill="#8884d8" /> {/* Scatter variable is used here */}
            </ScatterChart>
          </ResponsiveContainer>
        )

      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Charts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{chartTypes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Numeric Columns</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{numericColumns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Points</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{processedData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Visualizations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="auto" className="space-y-4">
        <TabsList>
          <TabsTrigger value="auto">{t.chartTypes}</TabsTrigger>
          <TabsTrigger value="custom">{t.customCharts}</TabsTrigger>
          <TabsTrigger value="insights">{t.insights}</TabsTrigger>
        </TabsList>

        <TabsContent value="auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Data Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.dataDistribution}</CardTitle>
                <CardDescription>Distribution of {numericColumns[0] || "numeric data"}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={prepareDistributionData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Trend Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.trendAnalysis}</CardTitle>
                <CardDescription>Trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={prepareTrendData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="index" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {numericColumns.slice(0, 2).map((col, index) => (
                      <Line key={col} type="monotone" dataKey={col} stroke={colors[index]} strokeWidth={2} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Correlation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.correlationMatrix}</CardTitle>
                <CardDescription>Relationship between variables</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <ScatterChart data={prepareCorrelationData()}>
                    <CartesianGrid />
                    <XAxis dataKey="x" />
                    <YAxis dataKey="y" />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter dataKey="y" fill="#8884d8" /> {/* Scatter variable is used here */}
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Chart Configuration</CardTitle>
                <CardDescription>Customize your visualization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Chart Type</label>
                  <Select value={selectedChart} onValueChange={setSelectedChart}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                      {chartTypes.map((type) => {
                        const Icon = type.icon
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">{t.selectXAxis}</label>
                  <Select value={selectedXAxis} onValueChange={setSelectedXAxis}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectXAxis} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColumns.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">{t.selectYAxis}</label>
                  <Select value={selectedYAxis} onValueChange={setSelectedYAxis}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectYAxis} />
                    </SelectTrigger>
                    <SelectContent>
                      {numericColumns.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                  disabled={!selectedXAxis || !selectedYAxis}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  {t.generateChart}
                </Button>
              </CardContent>
            </Card>

            {/* Custom Chart Display */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Custom Chart</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t.downloadChart}
                  </Button>
                </CardTitle>
                <CardDescription>
                  {selectedXAxis && selectedYAxis
                    ? `${selectedChart} chart: ${selectedXAxis} vs ${selectedYAxis}`
                    : t.selectBothAxes}
                </CardDescription>
              </CardHeader>
              <CardContent>{renderChart()}</CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>{t.keyInsights}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{t.insight1}</p>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{t.insight2}</p>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{t.insight3}</p>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{t.insight4}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{processedData.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Records</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {availableColumns.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Features</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {numericColumns.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Numeric</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {availableColumns.length - numericColumns.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Categorical</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
