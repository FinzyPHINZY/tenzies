import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const nodeElement = document.getElementById("root");
const root = createRoot(nodeElement);
root.render(<App />);
