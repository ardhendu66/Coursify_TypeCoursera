import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from "./Pages/Navbar";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Home from './Pages/Home';
import AddCourse from './Pages/AddCourse';
import AdminCourses from './Pages/AdminCourses';
import CourseForAdmin from './Pages/CourseForAdmin';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navbar />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/register',
        element: <Signup />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/addcourse',
        element: <AddCourse />
      },
      {
        path: '/admincourse',
        element: <AdminCourses />,
      },
      {
        path: '/admincourse/:courseId',
        element: <CourseForAdmin />,
      },
    ]
  }
])

export default () => <RouterProvider router={router} />