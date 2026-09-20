import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// import { AuthProvider } from "./context/AuthProvider";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Élément #root introuvable dans le DOM");
}

ReactDOM.createRoot(rootElement).render(
  <BrowserRouter>
      <App />
  </BrowserRouter>,
);
