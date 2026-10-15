import School from "../pages/admin/School";
import StudentDetails from "../pages/StudentDetails";
import Calendar from "../pages/Calendar";
import Dashboard from "../pages/Dashboard";
import ApplicationsPage from "../pages/student/ApplicationsPage";
import MySchool from "../pages/student/MySchool";
import Profile from "../pages/student/Profile";
import type { UserRole } from "../types/enum.type";
import type { Route } from "../types/global.type";

const sharedRoutes: Route[] = [
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "calendar",
    element: <Calendar />,
  },
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
    ...sharedRoutes,
    {
      path: "school",
      element: <School />,
    },
  ],
  staff: [
    ...sharedRoutes,
    {
      path: "campus",
      element: <School />,
    },
  ],
  student: [
    ...sharedRoutes,
    {
      path: "applications",
      element: <ApplicationsPage />,
    },
    {
      path: "documents",
      element: <Dashboard />,
    },
    {
      path: "school",
      element: <MySchool />,
    },
  ],
};
