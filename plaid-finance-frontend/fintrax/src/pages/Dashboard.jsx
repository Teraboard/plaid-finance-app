import React, { useState, useEffect } from "react";
import TransactionList from "../components/TransactionList";
import TransactionChart from "../components/TransactionChart";
import PlaidLinkButton from "../components/PlaidLinkButton";
import { transactionService } from "../services/transactionService";
import { plaidService } from "../services/plaidService";
import "./Dashboard.css";

function Dashboard({ darkMode, toggleDarkMode }) {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [linkedAccounts, setLinkedAccounts] = useState([]);

  // Load transactions when component mounts
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionService.getAllTransactions();
      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        setError('Received invalid data format from server');
      }
    } catch (error) {
      setError('Failed to load transactions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction) => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      await transactionService.addTransaction(transaction);
      
      // Show success message
      setSuccessMessage("Transaction added successfully!");
      
      // Force reload all transactions
      await loadTransactions();
    } catch (error) {
      setError('Failed to add transaction: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      await transactionService.deleteTransaction(id);
      
      // Show success message
      setSuccessMessage("Transaction deleted successfully!");
      
      // Force reload all transactions
      await loadTransactions();
    } catch (error) {
      setError('Failed to delete transaction: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const editTransaction = async (id, updatedTransaction) => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      await transactionService.updateTransaction(id, updatedTransaction);
      
      // Show success message
      setSuccessMessage("Transaction updated successfully!");
      
      // Force reload all transactions
      await loadTransactions();
    } catch (error) {
      setError('Failed to update transaction: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaidSuccess = async (plaidItem) => {
    setLoading(true);
    setError(null);
    try {
      // Add the new linked account to the state
      setLinkedAccounts((prevAccounts) => [...prevAccounts, plaidItem]);
      
      // Fetch transactions for the newly linked account
      const newTransactions = await plaidService.getTransactions(plaidItem.plaidItemId);
      
      // Show success message
      setSuccessMessage(`Successfully connected to ${plaidItem.institutionName} and imported ${newTransactions.length} transactions!`);
      
      // Reload all transactions
      await loadTransactions();
    } catch (error) {
      setError('Failed to import transactions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Automatically clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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
      
      {loading && <div className="loading-indicator">Loading transactions...</div>}
      {error && !loading && <div className="error-display">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="main-layout-container">
        {/* Left Column - Chart */}
        <div className="left-column">
          {transactions.length > 0 && !loading && !error && (
            <TransactionChart transactions={transactions} darkMode={darkMode} />
          )}
        </div>
        
        {/* Center Column - Transactions List */}
        <div className="center-column">
          <div className="dashboard-content">
            {/* Transaction List Section */}
            {transactions.length === 0 && !loading && !error ? (
              <div className="no-transactions-message">
                No transactions found. Add a transaction using the form or connect your bank account.
              </div>
            ) : (
              <TransactionList 
                transactions={transactions} 
                darkMode={darkMode} 
                onDeleteTransaction={deleteTransaction}
                onEditTransaction={editTransaction}
              />
            )}
          </div>
        </div>
        
        {/* Right Column - Add Transaction Form */}
        <div className="right-column">
          <form
            className={`transaction-form ${darkMode ? "dark-mode" : ""}`}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const newTransaction = {
                description: formData.get("description"),
                amount: parseFloat(parseFloat(formData.get("amount")).toFixed(2)),
                date: formData.get("date"),
                category: formData.get("category")
              };
              addTransaction(newTransaction);
              e.target.reset();
            }}
          >
            <h3 className="form-title">Add Transaction</h3>
            <div className="form-group">
              <input
                name="description"
                placeholder="Description (e.g., Fortnite V-Bux Card)"
                required
                className={`form-input ${darkMode ? "dark-mode" : ""}`}
              />
            </div>
            <div className="form-group">
              <input
                name="amount"
                type="number"
                step="0.01"
                placeholder="Amount (e.g., $19.00)"
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
                className={`form-input category-select ${darkMode ? "dark-mode" : ""}`}
              >
                <option value="">Expense Category</option>
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
            {error && <div className="error-message">{error}</div>}
          </form>
          
          {/* Connect Bank Account Section */}
          <div className={`plaid-section ${darkMode ? "dark-mode" : ""}`}>
            <h3 className="section-title">Connect Bank Account</h3>
            <p className="section-description">
              Automatically import your transactions by securely connecting your bank account.
            </p>
            <PlaidLinkButton 
              onSuccess={handlePlaidSuccess} 
              darkMode={darkMode} 
            />
          </div>
          
          {/* Refresh button */}
          <div className="refresh-section">
            <button 
              onClick={() => loadTransactions()} 
              className={`form-button ${darkMode ? "dark-mode" : ""}`}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;