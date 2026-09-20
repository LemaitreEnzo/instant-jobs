import { Route, Routes } from "react-router-dom";
import "./assets/css/default.css";
import "./assets/css/global.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { routes } from "./constants/routes.constant";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import type { Route as AppRoute } from "./types/global.type";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {routes.map((route: AppRoute, index: number) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route
          path="/unauthorized"
          element={
            <ProtectedRoute>
              <Unauthorized />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
