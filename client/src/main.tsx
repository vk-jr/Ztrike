import { createRoot } from "react-dom/client";
import App from "./App";
import { initializeTheme } from "./lib/themeService";
import "./index.css";

// Initialize theme before rendering
initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
