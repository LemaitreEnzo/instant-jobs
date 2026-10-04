import ProtectedRoute from "../components/ProtectedRoute";
import Calendar from "../pages/Calendar";
import Dashboard from "../pages/Dashboard";
import MySchool from "../pages/student/MySchool";
import Profile from "../pages/student/Profile";
import type { Route } from "../types/global.type";

export const routes: Array<Route> = [
  {
    path: "applications",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
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
