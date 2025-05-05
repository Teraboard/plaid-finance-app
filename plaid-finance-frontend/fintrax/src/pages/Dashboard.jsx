import React, { useState, useEffect } from "react";
import TransactionList from "../components/TransactionList";
import { transactionService } from "../services/transactionService";
import "./Dashboard.css";

function Dashboard({ darkMode, toggleDarkMode }) {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await transactionService.getAllTransactions();
      setTransactions(data);
      setError(null);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction) => {
    setLoading(true);
    try {
      await transactionService.addTransaction(transaction);
      await loadTransactions(); // Reload all transactions from the backend
      setError(null);
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const CATEGORIES = [
    'GROCERIES',
    'UTILITIES',
    'ENTERTAINMENT',
    'TRANSPORTATION',
    'DINING',
    'SHOPPING',
    'HEALTHCARE',
    'HOUSING',
    'INCOME',
    'SAVINGS',
    'OTHER',
    'UNCATEGORIZED'
  ];

  
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
            category: formData.get("category")
          };
          console.log('Submitting transaction:', newTransaction); // Debug log
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
        <div className="form-group">
          <select
            name="category"
            required
            style={{ width: '330px' }}
            className={`form-input ${darkMode ? "dark-mode" : ""}`}
          >
            <option value="">Select Category</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category.charAt(0) + category.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
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