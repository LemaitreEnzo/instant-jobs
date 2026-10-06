import { Route, Routes } from "react-router-dom";
import "./assets/css/default.css";
import "./assets/css/global.css";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { routes } from "./constants/routes.constant";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import type { Route as AppRoute } from "./types/global.type";

function App() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Chargement en cours...
      </div>
    );
  }

  const currentRoutes = role ? routes[role] || [] : [];

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/:organizationSlug"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        {currentRoutes.map((route: AppRoute, index: number) => (
          <Route
            key={`${role}-${route.path}-${index}`}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
