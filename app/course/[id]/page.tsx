"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CheckCircle, Download, Share2 } from "lucide-react"
import { Quiz } from "@/components/quiz"

// Sample course data
const sampleCourses = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    description: "Learn the fundamentals of machine learning algorithms and applications.",
    progress: 65,
    lessons: [
      {
        id: "l1",
        title: "What is Machine Learning?",
        content:
          "Machine learning is a branch of artificial intelligence (AI) and computer science which focuses on the use of data and algorithms to imitate the way that humans learn, gradually improving its accuracy.",
        completed: true,
      },
      {
        id: "l2",
        title: "Supervised vs. Unsupervised Learning",
        content:
          "Supervised learning uses labeled datasets to train algorithms to classify data or predict outcomes, while unsupervised learning uses unlabeled data to identify patterns and relationships.",
        completed: true,
      },
      {
        id: "l3",
        title: "Linear Regression",
        content:
          "Linear regression is a statistical method used to model the relationship between a dependent variable and one or more independent variables by fitting a linear equation to the observed data.",
        completed: false,
      },
      {
        id: "l4",
        title: "Decision Trees",
        content:
          "Decision trees are a non-parametric supervised learning method used for classification and regression tasks, where the goal is to create a model that predicts the value of a target variable by learning simple decision rules inferred from the data features.",
        completed: false,
      },
    ],
    quizzes: [
      {
        id: "q1",
        title: "Machine Learning Basics",
        questions: [
          {
            id: "q1-1",
            question: "What is the primary goal of supervised learning?",
            options: [
              "Finding hidden patterns in unlabeled data",
              "Predicting outcomes based on labeled data",
              "Clustering similar data points together",
              "Reducing the dimensionality of data",
            ],
            correctAnswer: 1,
          },
          {
            id: "q1-2",
            question: "Which of the following is NOT a type of machine learning?",
            options: [
              "Supervised learning",
              "Unsupervised learning",
              "Reinforcement learning",
              "Deterministic learning",
            ],
            correctAnswer: 3,
          },
        ],
        completed: false,
      },
    ],
  },
]

export default function CoursePage() {
  const params = useParams()
  const courseId = params.id as string
  const course = sampleCourses.find((c) => c.id === courseId)

  const [activeLesson, setActiveLesson] = useState(course?.lessons[0].id)
  const [completedLessons, setCompletedLessons] = useState(
    course?.lessons.filter((l) => l.completed).map((l) => l.id) || [],
  )

  if (!course) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <Link href="/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    )
  }

  const currentLesson = course.lessons.find((l) => l.id === activeLesson)

  const markLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId])
    }
  }

  const progressPercentage = Math.round((completedLessons.length / course.lessons.length) * 100)

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Lesson Content</TabsTrigger>
                  <TabsTrigger value="quiz">Quizzes</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="pt-4">
                  {currentLesson && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold">{currentLesson.title}</h2>
                      <div className="prose max-w-none dark:prose-invert">
                        <p>{currentLesson.content}</p>
                      </div>
                      <div className="flex justify-between pt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            const currentIndex = course.lessons.findIndex((l) => l.id === activeLesson)
                            if (currentIndex > 0) {
                              setActiveLesson(course.lessons[currentIndex - 1].id)
                            }
                          }}
                          disabled={course.lessons.findIndex((l) => l.id === activeLesson) === 0}
                        >
                          Previous Lesson
                        </Button>
                        <Button
                          onClick={() => {
                            markLessonComplete(currentLesson.id)
                            const currentIndex = course.lessons.findIndex((l) => l.id === activeLesson)
                            if (currentIndex < course.lessons.length - 1) {
                              setActiveLesson(course.lessons[currentIndex + 1].id)
                            }
                          }}
                        >
                          {completedLessons.includes(currentLesson.id) ? "Lesson Completed" : "Mark as Complete"}
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="quiz" className="pt-4">
                  {course.quizzes.length > 0 ? (
                    <Quiz quiz={course.quizzes[0]} />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No quizzes available for this course yet.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="lessons">
                  <AccordionTrigger>Lessons</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {course.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`p-2 rounded-md cursor-pointer flex items-center justify-between ${
                            activeLesson === lesson.id ? "bg-gray-100 dark:bg-gray-800" : ""
                          }`}
                          onClick={() => setActiveLesson(lesson.id)}
                        >
                          <span className="line-clamp-1">{lesson.title}</span>
                          {completedLessons.includes(lesson.id) && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="quizzes">
                  <AccordionTrigger>Quizzes</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {course.quizzes.map((quiz) => (
                        <div key={quiz.id} className="p-2 rounded-md cursor-pointer flex items-center justify-between">
                          <span className="line-clamp-1">{quiz.title}</span>
                          {quiz.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download as PDF
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

