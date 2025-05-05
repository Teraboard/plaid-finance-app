import React, { useEffect, useState } from "react";
import TransactionList from "../components/TransactionList";
import "./Dashboard.css";

function Dashboard({ darkMode, toggleDarkMode }) {
  const [transactions, setTransactions] = useState([
  ]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, { id: transactions.length + 1, ...transaction }]);
  };

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      <header className="dashboard-header">
        <h2 className="dashboard-title">Dashboard</h2>
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </header>
      <TransactionList transactions={transactions} darkMode={darkMode} />
      <form
        className={`transaction-form ${darkMode ? "dark-mode" : ""}`}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const newTransaction = {
            description: formData.get("description"),
            amount: parseFloat(formData.get("amount")),
            date: formData.get("date"),
          };
          addTransaction(newTransaction);
          e.target.reset();
        }}
      >
        <h3 className="form-title">Add Transaction</h3>
        <div className="form-group">
          <input
            name="description"
            placeholder="Description"
            required
            className={`form-input ${darkMode ? "dark-mode" : ""}`}
          />
        </div>
        <div className="form-group">
          <input
            name="amount"
            type="number"
            placeholder="Amount"
            required
            className={`form-input ${darkMode ? "dark-mode" : ""}`}
          />
        </div>
        <div className="form-group">
          <input
            name="date"
            type="date"
            required
            className={`form-input ${darkMode ? "dark-mode" : ""}`}
          />
        </div>
        <button
          type="submit"
          className={`form-button ${darkMode ? "dark-mode" : ""}`}
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default Dashboard;