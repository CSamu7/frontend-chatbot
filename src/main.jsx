import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ErrorDetailsProvider from "./context/ErrorContextProvider.jsx";
import UserProvider from "./context/UserProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorDetailsProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </ErrorDetailsProvider>
  </StrictMode>
);