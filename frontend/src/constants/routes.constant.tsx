import ProtectedRoute from "../components/ProtectedRoute";
import Calendar from "../pages/Calendar";
import Dashboard from "../pages/Dashboard";
import MySchool from "../pages/student/MySchool";
import Profile from "../pages/student/Profile";
import type { UserRole } from "../types/enum.type";
import type { Route } from "../types/global.type";

const sharedRoutes: Route[] = [
  {
    path: "documents",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "calendar",
    element: (
      <ProtectedRoute>
        <Calendar />
      </ProtectedRoute>
    ),
  },
  {
    path: "school",
    element: (
      <ProtectedRoute>
        <MySchool />
      </ProtectedRoute>
    ),
  },
  {
    path: "profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "settings",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
];

export const routes: Record<UserRole, Route[]> = {
  admin: sharedRoutes,
  staff: sharedRoutes,
  student: [
    ...sharedRoutes,
    {
      path: "applications",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
  ],
};
