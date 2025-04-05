"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { FileUpload } from "@/components/file-upload"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  inputType: z.enum(["text", "document"]),
  topic: z.string().optional(),
  contentStructure: z.enum(["modular", "flexible", "difficulty", "practice", "paths"]),
  outputFormat: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You must select at least one output format.",
  }),
  features: z.array(z.string()),
})

export default function CreateCoursePage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      inputType: "text",
      topic: "",
      contentStructure: "modular",
      outputFormat: ["text"],
      features: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
  setIsGenerating(true)

  try {
    const formData = new FormData()
    formData.append("data", JSON.stringify(values))
    if (file) {
      formData.append("file", file)
    }

    const response = await fetch("/api/openai", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "Course generation failed.")
    }

    // ✅ Create course object
    const courseData = {
      id: Date.now().toString(),
      title: values.title,
      description: values.description,
      topic: values.topic,
      structure: values.contentStructure,
      format: values.outputFormat,
      features: values.features,
      content: result.content,
      lessons: 15, // placeholder, adjust as needed
      quizzes: values.features.quizzes ? 5 : 0,
      progress: 0,
      lastAccessed: new Date().toISOString(),
    }

    // ✅ Save to localStorage
    const stored = localStorage.getItem("courses")
    const existingCourses = stored ? JSON.parse(stored) : []
    existingCourses.push(courseData)
    localStorage.setItem("courses", JSON.stringify(existingCourses))

    toast({
      title: "Course created successfully!",
      description: "Your course has been generated and is now available in your dashboard.",
    })

    router.push("/dashboard")
  } catch (error) {
    console.error("Error generating course:", error)
    toast({
      title: "Error",
      description: "There was a problem generating your course.",
      variant: "destructive",
    })
  } finally {
    setIsGenerating(false)
  }
}

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Course</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>Provide basic information about your course.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Introduction to Machine Learning" {...field} />
                    </FormControl>
                    <FormDescription>Give your course a descriptive title.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A comprehensive introduction to machine learning concepts and applications."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Briefly describe what your course will cover.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Source</CardTitle>
              <CardDescription>Choose how you want to create your course content.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="text"
                onValueChange={(value) => form.setValue("inputType", value as "text" | "document")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Enter Topic/Question</TabsTrigger>
                  <TabsTrigger value="document">Upload Document</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="pt-4">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Learning Topic or Question</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What is machine learning and how is it applied in real-world scenarios?"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter a specific topic or question you want the course to address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="document" className="pt-4">
                  <FileUpload onFileChange={setFile} acceptedFileTypes=".pdf,.docx,.txt" maxSizeMB={10} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>Choose how your course content will be structured.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="contentStructure"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="modular" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Modular Lessons (Organized into chapters and sections)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="flexible" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Flexible Pacing (Self-paced learning with checkpoints)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="difficulty" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Difficulty Levels (Progressive learning from basic to advanced)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="practice" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Practice-Oriented (Focus on exercises and applications)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="paths" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Learning Paths (Branching content based on interests)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Output Format & Features</CardTitle>
              <CardDescription>
                Select how your course content will be presented and what features to include.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="outputFormat"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Output Format</FormLabel>
                      <FormDescription>Select at least one format for your course content.</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="outputFormat"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("text")}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, "text"])
                                    : field.onChange(field.value?.filter((value) => value !== "text"))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Text Content</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="outputFormat"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("audio")}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, "audio"])
                                    : field.onChange(field.value?.filter((value) => value !== "audio"))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Audio Narration</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="outputFormat"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("video")}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, "video"])
                                    : field.onChange(field.value?.filter((value) => value !== "video"))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Video Presentations</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="features"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Additional Features</FormLabel>
                      <FormDescription>Select the features you want to include in your course.</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="features"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("quizzes")}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, "quizzes"])
                                    : field.onChange(field.value?.filter((value) => value !== "quizzes"))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Interactive Quizzes</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="features"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("pdfs")}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, "pdfs"])
                                    : field.onChange(field.value?.filter((value) => value !== "pdfs"))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Downloadable PDFs</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="features"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("tracking")}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, "tracking"])
                                    : field.onChange(field.value?.filter((value) => value !== "tracking"))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Progress Tracking</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="features"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("sharing")}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, "sharing"])
                                    : field.onChange(field.value?.filter((value) => value !== "sharing"))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Course Sharing</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? "Generating Course..." : "Create Course"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}

