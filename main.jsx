// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";

// 1) Charger Firebase EN PREMIER (configure window.storage)
import "./firebase-storage.js";

// 2) Charger l'app après (elle utilise window.storage qui est prêt)
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
