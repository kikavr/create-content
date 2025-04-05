"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Share2, Play, Edit, Plus, Trash2 } from "lucide-react"

// Sample course data
const sampleCourses = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    description: "Learn the fundamentals of machine learning algorithms and applications.",
    progress: 65,
    lessons: 12,
    quizzes: 5,
    lastAccessed: "2 days ago",
    createdAt: "2024-03-15",
  },
  {
    id: "2",
    title: "Web Development Fundamentals",
    description: "Master HTML, CSS, and JavaScript to build modern websites.",
    progress: 30,
    lessons: 20,
    quizzes: 8,
    lastAccessed: "1 week ago",
    createdAt: "2024-02-28",
  },
  {
    id: "3",
    title: "Data Science Essentials",
    description: "Explore data analysis, visualization, and statistical methods.",
    progress: 10,
    lessons: 15,
    quizzes: 6,
    lastAccessed: "Just now",
    createdAt: "2024-04-01",
  },
]

export default function DashboardPage() {
  const [courses, setCourses] = useState(sampleCourses)
  const [activeTab, setActiveTab] = useState("all")

  const filteredCourses =
    activeTab === "all"
      ? courses
      : activeTab === "in-progress"
        ? courses.filter((course) => course.progress > 0 && course.progress < 100)
        : courses.filter((course) => course.progress === 100)

  const deleteCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id))
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Link href="/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New Course
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No courses found</h3>
          <p className="text-gray-500 mb-6">
            {activeTab === "all"
              ? "You haven't created any courses yet."
              : activeTab === "in-progress"
                ? "You don't have any courses in progress."
                : "You haven't completed any courses yet."}
          </p>
          <Link href="/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Your First Course
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Lessons</p>
                      <p className="font-medium">{course.lessons}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Quizzes</p>
                      <p className="font-medium">{course.quizzes}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500">Last accessed</p>
                    <p className="font-medium">{course.lastAccessed}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/course/${course.id}`}>
                      <Play className="h-4 w-4" />
                      <span className="sr-only">Continue</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/edit/${course.id}`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => deleteCourse(course.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

