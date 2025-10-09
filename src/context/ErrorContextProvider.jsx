import { useState } from "react";
import { ErrorContext } from "./ErrorContext";

const ErrorDetailsProvider = ({ children }) => {
  const [error, setError] = useState("");

  return (
    <ErrorContext.Provider value={[error, setError]}>
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorDetailsProvider;
