import { Route, Routes } from "react-router";
import "./assets/css/default.css";
import "./assets/css/global.css";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
