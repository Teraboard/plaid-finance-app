import React, { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved preference or system preference
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    
    // Apply the dark mode class to body
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      <header className="App-header">
        <h1>FinTrax</h1>
      </header>
      <main>
        <Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </main>
    </div>
  );
}

export default App;