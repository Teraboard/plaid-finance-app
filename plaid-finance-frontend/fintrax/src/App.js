import React, { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      <header className="App-header">
        <h1>Financial Tracker</h1>
      </header>
      <main>
        <Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </main>
    </div>
  );
}

export default App;