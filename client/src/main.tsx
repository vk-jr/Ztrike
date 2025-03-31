import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeTheme } from "@/lib/themeService";

// Initialize theme from saved preferences before rendering the app
initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
