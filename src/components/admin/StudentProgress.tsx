import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Star,
  Award
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  enrolled_courses: string[];
  progress: {
    [courseId: string]: {
      completed_lessons: string[];
      quiz_scores: {
        [quizId: string]: number;
      };
      last_accessed: string;
      overall_progress: number;
    };
  };
}

interface Course {
  id: string;
  title: string;
  modules: {
    id: string;
    title: string;
    lessons: {
      id: string;
      title: string;
      type: string;
    }[];
  }[];
}

export default function StudentProgress() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch students
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*');

      if (studentsError) throw studentsError;

      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*');

      if (coursesError) throw coursesError;

      setStudents(studentsData || []);
      setCourses(coursesData || []);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQuizScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Progress</h1>
        <p className="text-gray-600 mt-1">Track and manage student learning progress</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Students</h2>
          </div>
          <div className="divide-y">
            {students.map(student => (
              <div
                key={student.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedStudent?.id === student.id ? 'bg-indigo-50' : ''
                }`}
                onClick={() => setSelectedStudent(student)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={student.avatar_url}
                    alt={student.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          {selectedStudent ? (
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={selectedStudent.avatar_url}
                  alt={selectedStudent.name}
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h2>
                  <p className="text-gray-600">{selectedStudent.email}</p>
                </div>
              </div>

              <div className="space-y-6">
                {selectedStudent.enrolled_courses.map(courseId => {
                  const course = courses.find(c => c.id === courseId);
                  const progress = selectedStudent.progress[courseId];

                  if (!course || !progress) return null;

                  return (
                    <div key={courseId} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{course.title}</h3>
                          <div className="flex items-center mt-1">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  progress.overall_progress >= 80 ? 'bg-green-500' :
                                  progress.overall_progress >= 50 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${progress.overall_progress}%` }}
                              />
                            </div>
                            <span className={`ml-2 text-sm font-medium ${getProgressColor(progress.overall_progress)}`}>
                              {progress.overall_progress}%
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setExpandedCourse(expandedCourse === courseId ? null : courseId)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {expandedCourse === courseId ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </div>

                      {expandedCourse === courseId && (
                        <div className="mt-4 space-y-4">
                          {course.modules.map(module => (
                            <div key={module.id} className="pl-4 border-l-2 border-gray-200">
                              <h4 className="font-medium text-gray-900">{module.title}</h4>
                              <div className="mt-2 space-y-2">
                                {module.lessons.map(lesson => {
                                  const isCompleted = progress.completed_lessons.includes(lesson.id);
                                  return (
                                    <div
                                      key={lesson.id}
                                      className="flex items-center justify-between py-1"
                                    >
                                      <div className="flex items-center">
                                        {isCompleted ? (
                                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        ) : (
                                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                        )}
                                        <span className="text-sm text-gray-600">{lesson.title}</span>
                                      </div>
                                      {lesson.type === 'quiz' && progress.quiz_scores[lesson.id] !== undefined && (
                                        <span className={`text-sm font-medium ${getQuizScoreColor(progress.quiz_scores[lesson.id])}`}>
                                          {progress.quiz_scores[lesson.id]}%
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>Last accessed: {formatDate(progress.last_accessed)}</span>
                              {progress.overall_progress === 100 && (
                                <div className="flex items-center text-green-600">
                                  <Award className="h-4 w-4 mr-1" />
                                  <span>Course Completed</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              Select a student to view their progress
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 