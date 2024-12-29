import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundaryFallback from "./ui/ErrorBoundaryFallback.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      fallback={<ErrorBoundaryFallback />}
      onError={(error, info) => {
        console.error("Error boundary caught an error", error, info);
      }
      }
      onReset={() => {
        window.location.replace("/");
      }}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>
);
