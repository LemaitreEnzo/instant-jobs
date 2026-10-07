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
    path: "documents",
    element: <Dashboard />,
  },
  {
    path: "calendar",
    element: <Calendar />,
  },
  {
    path: "school",
    element: <MySchool />,
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
  admin: sharedRoutes,
  staff: sharedRoutes,
  student: [
    ...sharedRoutes,
    {
      path: "applications",
      element: <ApplicationsPage />,
    },
  ],
};
