import * as React from "react";
import  { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, ChevronDown, ChevronUp, Share2, Search, BookOpen, Users , View } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from 'react-router-dom'

export default function CourseEvaluations() {
  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCourse, setExpandedCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [studentCounts, setStudentCounts] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [coursesResponse, studentCountsResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_LINK}/api/courses/GetFormationsOfMentor`, {
            credentials: 'include'
          }),
          fetch(`${import.meta.env.VITE_API_LINK}/api/evaluation/SubmitEvaluation`, {
            credentials: 'include'
          })
        ])

        if (!coursesResponse.ok) throw new Error("Failed to fetch courses")
        if (!studentCountsResponse.ok) throw new Error("Failed to fetch student counts")

        const coursesData = await coursesResponse.json()
        const studentCountsData = await studentCountsResponse.json()

        setCourses(coursesData)
        setStudentCounts(studentCountsData.reduce((acc, curr) => {
          acc[curr._id] = curr.numberOfCandidates
          return acc
        }, {}))
        setError(null)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])
  
  const toggleExpand = (courseId) => {
    setExpandedCourse(prev => (prev === courseId ? null : courseId))
  }

  const generateEvaluationLink = async (courseId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_LINK}/api/evaluation/GenerateEvaluationLink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
        credentials: 'include',
      })
      if (!response.ok) throw new Error("Failed to generate evaluation link")
      const { evaluationLink } = await response.json()
      navigator.clipboard.writeText(evaluationLink)
      toast.success('Evaluation link generated and copied to clipboard')
      toast.info(`Evaluation link: ${evaluationLink}`)
    } catch (error) {
      console.error("Error generating evaluation link:", error)
      toast.error('Failed to generate evaluation link. Please try again.')
    }
  }

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const gotoresult = (id)=> navigate(`/evalution/${id}`);

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-100 to-orange-200">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-500"></div>
    </div>
  )

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-100 to-orange-200">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-200">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-orange-600 mb-8 text-center">Courses Evaluations</h1>
        <div className="relative w-full max-w-md mx-auto mb-12">
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 w-full rounded-full shadow-lg ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" size={24} />
        </div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {filteredCourses.map((course) => (
            <motion.div
              key={course._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold truncate">{course.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpand(course._id)}
                      className="text-white hover:bg-white/20 transition-colors duration-200"
                      aria-label={expandedCourse === course._id ? "Collapse course details" : "Expand course details"}
                    >
                      {expandedCourse === course._id ? (
                        <ChevronUp className="h-6 w-6" />
                      ) : (
                        <ChevronDown className="h-6 w-6" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <p className="text-sm text-gray-600">
                      {`${new Date(course.startDate).toLocaleDateString()} - ${new Date(course.endDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                      {course.type}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{studentCounts[course._id] || 0} students</span>
                    </div>
                  </div>
                </CardContent>
                <AnimatePresence>
                  {expandedCourse === course._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardFooter className="bg-orange-50 pt-3 ">
                        <Button 
                          onClick={() => generateEvaluationLink(course._id)}
                          className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200"
                        >
                          <Share2 className="w-5 h-5" />
                          <span>Generate Evaluation Link</span>
                        </Button>
                      </CardFooter>

                      <CardFooter className="bg-orange-50">
                        <Button 
                          onClick={() => gotoresult(course._id) }
                          className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200"
                        >
                          <View className="w-5 h-5" />
                          <span> see the result</span>
                        </Button>
                      </CardFooter>
                      
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        {filteredCourses.length === 0 && (
          <motion.div 
            className="flex flex-col items-center justify-center h-64 text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Search className="w-16 h-16 text-orange-300 mb-4" />
            <p className="text-xl font-medium text-orange-600">No courses found.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search terms.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}