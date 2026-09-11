import { Route, Routes } from "react-router";
import "./assets/css/default.css";
import "./assets/css/global.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import MainLayout from "./components/layout/MainLayout/MainLayout";

const ProtectedAppspaceRoute = ({ children }) => {
  return <MainLayout>{children}</MainLayout>;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedAppspaceRoute>
              <Dashboard />
            </ProtectedAppspaceRoute>
          }
        />
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
