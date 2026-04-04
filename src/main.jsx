import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ErrorDetailsProvider from "./context/ErrorContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorDetailsProvider>
      <App />
    </ErrorDetailsProvider>
  </StrictMode>
);
