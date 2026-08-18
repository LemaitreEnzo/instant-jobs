import { Route, Routes } from "react-router";
import "./assets/css/default.css";
import "./assets/css/global.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
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
