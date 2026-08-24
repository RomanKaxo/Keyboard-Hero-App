import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Login } from './screens/Login'
import { StudentDashboard } from './screens/student/Dashboard'
import { Lessons } from './screens/student/Lessons'
import { Recording } from './screens/student/Recording'
import { Profile } from './screens/student/Profile'
import { TeacherDashboard } from './screens/teacher/Dashboard'
import { Students } from './screens/teacher/Students'
import { LessonLibrary } from './screens/teacher/LessonLibrary'
import { Grading } from './screens/teacher/Grading'
import { RequireRole } from './components/routing/RequireRole'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <Login /> },
  {
    path: '/student',
    element: (
      <RequireRole role="student">
        <StudentDashboard />
      </RequireRole>
    ),
  },
  {
    path: '/student/lessons',
    element: (
      <RequireRole role="student">
        <Lessons />
      </RequireRole>
    ),
  },
  {
    path: '/student/recording',
    element: (
      <RequireRole role="student">
        <Recording />
      </RequireRole>
    ),
  },
  {
    path: '/student/profile',
    element: (
      <RequireRole role="student">
        <Profile />
      </RequireRole>
    ),
  },
  {
    path: '/teacher',
    element: (
      <RequireRole role="admin">
        <TeacherDashboard />
      </RequireRole>
    ),
  },
  {
    path: '/teacher/students',
    element: (
      <RequireRole role="admin">
        <Students />
      </RequireRole>
    ),
  },
  {
    path: '/teacher/library',
    element: (
      <RequireRole role="admin">
        <LessonLibrary />
      </RequireRole>
    ),
  },
  {
    path: '/teacher/grading',
    element: (
      <RequireRole role="admin">
        <Grading />
      </RequireRole>
    ),
  },
])
