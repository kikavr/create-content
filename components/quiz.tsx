"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle } from "lucide-react"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

interface QuizProps {
  quiz: {
    id: string
    title: string
    questions: Question[]
    completed?: boolean
  }
}

export function Quiz({ quiz }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | null>>({})
  const [showResults, setShowResults] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: Number.parseInt(value),
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    setQuizCompleted(true)
  }

  const handleRetake = () => {
    setSelectedAnswers({})
    setCurrentQuestionIndex(0)
    setShowResults(false)
    setQuizCompleted(false)
  }

  const calculateScore = () => {
    let correctCount = 0
    quiz.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++
      }
    })
    return {
      correct: correctCount,
      total: totalQuestions,
      percentage: Math.round((correctCount / totalQuestions) * 100),
    }
  }

  const isAnswerSelected = selectedAnswers[currentQuestion?.id] !== undefined

  if (showResults) {
    const score = calculateScore()

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{quiz.title} - Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{score.percentage}%</div>
            <p className="text-lg">
              You got {score.correct} out of {score.total} questions correct
            </p>
          </div>

          <div className="space-y-4">
            {quiz.questions.map((question, index) => {
              const selectedAnswer = selectedAnswers[question.id]
              const isCorrect = selectedAnswer === question.correctAnswer

              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium mb-2">
                        Question {index + 1}: {question.question}
                      </p>
                      <div className="ml-2">
                        <p className="text-sm">
                          Your answer:{" "}
                          <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                            {selectedAnswer !== null ? question.options[selectedAnswer] : "Not answered"}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600">
                            Correct answer: {question.options[question.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleRetake}>Retake Quiz</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">{currentQuestion.question}</h3>

          <RadioGroup value={selectedAnswers[currentQuestion.id]?.toString() || ""} onValueChange={handleAnswerSelect}>
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <Button onClick={handleNext} disabled={!isAnswerSelected}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!isAnswerSelected}>
            Submit Quiz
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

