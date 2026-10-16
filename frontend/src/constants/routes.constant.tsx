/**
 * Route configurations segmented by user role (admin, staff, student).
 * Maps relative URL sub-paths to page views rendered inside the authenticated MainLayout shell.
 */
import School from "../pages/admin/School";
import Calendar from "../pages/Calendar";
import Dashboard from "../pages/Dashboard";
import Documents from "../pages/Documents";
import ApplicationsPage from "../pages/student/ApplicationsPage";
import MySchool from "../pages/student/MySchool";
import Profile from "../pages/student/Profile";
import StudentDetails from "../pages/StudentDetails";
import type { UserRole } from "../types/enum.type";
import type { Route } from "../types/global.type";

const sharedRoutes: Route[] = [
  {
    path: "student/:id",
    element: <StudentDetails />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "settings",
    element: <Dashboard />,
  },
];

export const routes: Record<UserRole, Route[]> = {
  admin: [
    {
      path: "school",
      element: <School />,
    },
    ...sharedRoutes,
  ],
  staff: [
    {
      path: "campus",
      element: <School />,
    },
    ...sharedRoutes,
  ],
  student: [
    {
      path: "dashboard",
      element: <Dashboard />,
    },
    {
      path: "applications",
      element: <ApplicationsPage />,
    },
    {
      path: "documents",
      element: <Documents />,
    },
    {
      path: "calendar",
      element: <Calendar />,
    },
    {
      path: "school",
      element: <MySchool />,
    },
    ...sharedRoutes,
  ],
};
