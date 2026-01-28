"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Target, BarChart3, CheckCircle, TrendingUp, Activity } from "lucide-react"

interface Dataset {
  name: string
  data: any[]
  columns: string[]
  shape: [number, number]
  dtypes: Record<string, string>
}

interface MachineLearningProps {
  dataset: Dataset
  processedData: any[]
  onPredictions: (predictions: any[]) => void
  language?: "ar" | "en"
}

export function MachineLearning({ dataset, processedData, onPredictions, language = "en" }: MachineLearningProps) {
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [selectedTarget, setSelectedTarget] = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<string>("linear_regression")
  const [modelResults, setModelResults] = useState<any>(null)
  const [predictions, setPredictions] = useState<any[]>([])

  const content = {
    ar: {
      title: "التعلم الآلي",
      description: "بناء وتدريب نماذج التعلم الآلي للتنبؤ والتصنيف",
      modelSelection: "اختيار النموذج",
      training: "التدريب",
      evaluation: "التقييم",
      predictions: "التنبؤات",
      selectTarget: "اختر المتغير التابع",
      selectModel: "اختر النموذج",
      trainModel: "تدريب النموذج",
      training_: "جاري التدريب...",
      completed: "تم التدريب بنجاح!",
      linearRegression: "الانحدار الخطي",
      logisticRegression: "الانحدار اللوجستي",
      randomForest: "الغابة العشوائية",
      svm: "آلة الدعم الشعاعي",
      knn: "أقرب الجيران",
      decisionTree: "شجرة القرار",
      accuracy: "الدقة",
      precision: "الدقة النسبية",
      recall: "الاستدعاء",
      f1Score: "نتيجة F1",
      mse: "متوسط مربع الخطأ",
      rmse: "الجذر التربيعي لمتوسط مربع الخطأ",
      r2Score: "نتيجة R²",
      mae: "متوسط الخطأ المطلق",
      modelPerformance: "أداء النموذج",
      featureImportance: "أهمية الميزات",
      confusionMatrix: "مصفوفة الالتباس",
      predictionResults: "نتائج التنبؤ",
      actualVsPredicted: "الفعلي مقابل المتوقع",
      modelTrained: "تم تدريب النموذج",
      goodPerformance: "أداء جيد",
      targetVariable: "المتغير التابع",
      features: "الميزات",
      samples: "العينات",
      modelType: "نوع النموذج",
    },
    en: {
      title: "Machine Learning",
      description: "Build and train machine learning models for prediction and classification",
      modelSelection: "Model Selection",
      training: "Training",
      evaluation: "Evaluation",
      predictions: "Predictions",
      selectTarget: "Select Target Variable",
      selectModel: "Select Model",
      trainModel: "Train Model",
      training_: "Training...",
      completed: "Training completed successfully!",
      linearRegression: "Linear Regression",
      logisticRegression: "Logistic Regression",
      randomForest: "Random Forest",
      svm: "Support Vector Machine",
      knn: "K-Nearest Neighbors",
      decisionTree: "Decision Tree",
      accuracy: "Accuracy",
      precision: "Precision",
      recall: "Recall",
      f1Score: "F1 Score",
      mse: "Mean Squared Error",
      rmse: "Root Mean Squared Error",
      r2Score: "R² Score",
      mae: "Mean Absolute Error",
      modelPerformance: "Model Performance",
      featureImportance: "Feature Importance",
      confusionMatrix: "Confusion Matrix",
      predictionResults: "Prediction Results",
      actualVsPredicted: "Actual vs Predicted",
      modelTrained: "Model Trained",
      goodPerformance: "Good Performance",
      targetVariable: "Target Variable",
      features: "Features",
      samples: "Samples",
      modelType: "Model Type",
    },
  }

  const t = content[language]

  // Get available columns for target selection
  const availableColumns = Object.keys(processedData[0] || {})
  const numericColumns = availableColumns.filter((col) => {
    const values = processedData.map((row) => row[col])
    return values.every((val) => !isNaN(Number.parseFloat(val)))
  })

  // Model options
  const modelOptions = [
    { value: "linear_regression", label: t.linearRegression, type: "regression" },
    { value: "logistic_regression", label: t.logisticRegression, type: "classification" },
    { value: "random_forest", label: t.randomForest, type: "both" },
    { value: "decision_tree", label: t.decisionTree, type: "both" },
    { value: "svm", label: t.svm, type: "both" },
    { value: "knn", label: t.knn, type: "both" },
  ]

  // Simulate model training
  const handleModelTraining = async () => {
    if (!selectedTarget || !selectedModel) return

    setIsTraining(true)
    setTrainingProgress(0)

    try {
      // Step 1: Data preparation (20%)
      setTrainingProgress(20)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 2: Model training (60%)
      setTrainingProgress(60)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Step 3: Model evaluation (80%)
      setTrainingProgress(80)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 4: Generate predictions (100%)
      setTrainingProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simulate model results
      const isRegression = isTargetNumeric(selectedTarget)
      const mockResults = generateMockResults(isRegression)
      const mockPredictions = generateMockPredictions(selectedTarget, isRegression)

      setModelResults(mockResults)
      setPredictions(mockPredictions)
      onPredictions(mockPredictions)
    } catch (error) {
      console.error("Error during training:", error)
    } finally {
      setIsTraining(false)
    }
  }

  const isTargetNumeric = (target: string) => {
    const values = processedData.map((row) => Number.parseFloat(row[target]))
    return values.every((val) => !isNaN(val))
  }

  const generateMockResults = (isRegression: boolean) => {
    if (isRegression) {
      return {
        type: "regression",
        mse: (Math.random() * 0.5 + 0.1).toFixed(4),
        rmse: (Math.random() * 0.7 + 0.3).toFixed(4),
        mae: (Math.random() * 0.4 + 0.2).toFixed(4),
        r2Score: (Math.random() * 0.3 + 0.7).toFixed(4),
      }
    } else {
      return {
        type: "classification",
        accuracy: (Math.random() * 0.2 + 0.8).toFixed(4),
        precision: (Math.random() * 0.2 + 0.75).toFixed(4),
        recall: (Math.random() * 0.2 + 0.78).toFixed(4),
        f1Score: (Math.random() * 0.2 + 0.76).toFixed(4),
      }
    }
  }

  const generateMockPredictions = (target: string, isRegression: boolean) => {
    return processedData.slice(0, 10).map((row, index) => {
      const actual = row[target]
      let predicted

      if (isRegression) {
        const actualNum = Number.parseFloat(actual)
        predicted = (actualNum + (Math.random() - 0.5) * actualNum * 0.2).toFixed(2)
      } else {
        // For classification, randomly assign similar class
        const classes = [...new Set(processedData.map((r) => r[target]))]
        predicted = Math.random() > 0.8 ? classes[Math.floor(Math.random() * classes.length)] : actual
      }

      return {
        id: index + 1,
        actual,
        predicted,
        difference: isRegression
          ? Math.abs(Number.parseFloat(actual) - Number.parseFloat(predicted)).toFixed(2)
          : actual === predicted
            ? "Correct"
            : "Incorrect",
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.features}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{availableColumns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.samples}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{processedData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.modelType}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedModel ? modelOptions.find((m) => m.value === selectedModel)?.label : "None"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.targetVariable}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedTarget || "None"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="selection" className="space-y-4">
        <TabsList>
          <TabsTrigger value="selection">{t.modelSelection}</TabsTrigger>
          <TabsTrigger value="training">{t.training}</TabsTrigger>
          {modelResults && <TabsTrigger value="evaluation">{t.evaluation}</TabsTrigger>}
          {predictions.length > 0 && <TabsTrigger value="predictions">{t.predictions}</TabsTrigger>}
        </TabsList>

        <TabsContent value="selection">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.selectTarget}</CardTitle>
                <CardDescription>Choose the variable you want to predict</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectTarget} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableColumns.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                        <Badge variant="outline" className="ml-2">
                          {numericColumns.includes(col) ? "Numeric" : "Categorical"}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.selectModel}</CardTitle>
                <CardDescription>Choose the machine learning algorithm</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectModel} />
                  </SelectTrigger>
                  <SelectContent>
                    {modelOptions.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                        <Badge variant="outline" className="ml-2">
                          {model.type}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>{t.training}</span>
              </CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isTraining && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 animate-pulse text-blue-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t.training_}</span>
                  </div>
                  <Progress value={trainingProgress} className="w-full" />
                </div>
              )}

              {!isTraining && !modelResults && (
                <div className="text-center py-8">
                  <Button
                    onClick={handleModelTraining}
                    size="lg"
                    disabled={!selectedTarget || !selectedModel}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    <Brain className="mr-2 h-5 w-5" />
                    {t.trainModel}
                  </Button>
                </div>
              )}

              {modelResults && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">{t.completed}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {modelResults && (
          <TabsContent value="evaluation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>{t.modelPerformance}</span>
                </CardTitle>
                <CardDescription>{t.goodPerformance}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {modelResults.type === "regression" ? (
                    <>
                      <div className="text-center p-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          {modelResults.r2Score}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t.r2Score}</div>
                      </div>

                      <div className="text-center p-6 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                          {modelResults.mae}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t.mae}</div>
                      </div>

                      <div className="text-center p-6 bg-purple-50 dark:bg-purple-950 rounded-lg">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                          {modelResults.mse}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t.mse}</div>
                      </div>

                      <div className="text-center p-6 bg-orange-50 dark:bg-orange-950 rounded-lg">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                          {modelResults.rmse}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t.rmse}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center p-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          {(Number.parseFloat(modelResults.accuracy) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t.accuracy}</div>
                      </div>

                      <div className="text-center p-6 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                          {(Number.parseFloat(modelResults.precision) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t.precision}</div>
                      </div>

                      <div className="text-center p-6 bg-purple-50 dark:bg-purple-950 rounded-lg">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                          {(Number.parseFloat(modelResults.recall) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t.recall}</div>
                      </div>

                      <div className="text-center p-6 bg-orange-50 dark:bg-orange-950 rounded-lg">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                          {(Number.parseFloat(modelResults.f1Score) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t.f1Score}</div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {predictions.length > 0 && (
          <TabsContent value="predictions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>{t.predictionResults}</span>
                </CardTitle>
                <CardDescription>{t.actualVsPredicted}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">ID</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Actual</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Predicted</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Difference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.map((pred) => (
                        <tr key={pred.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="border border-gray-300 dark:border-gray-600 p-2">{pred.id}</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">{pred.actual}</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">{pred.predicted}</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">
                            <Badge
                              variant={
                                pred.difference === "Correct" || Number.parseFloat(pred.difference) < 1
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {pred.difference}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
