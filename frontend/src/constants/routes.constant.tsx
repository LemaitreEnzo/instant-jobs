import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import MySchool from "../pages/student/MySchool";
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
        <Dashboard />
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
        <Dashboard />
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
