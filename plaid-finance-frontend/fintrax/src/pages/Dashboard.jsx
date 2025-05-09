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
  const [viewSummary, setViewSummary] = useState(true);

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

  // Automatically clear success message after 1.5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 1500);
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

  // Calculate summary data
  const calculateSummary = () => {
    if (!transactions.length) return { income: 0, expenses: 0, balance: 0 };
    
    return transactions.reduce((summary, transaction) => {
      const amount = transaction.amount || 0;
      if (amount > 0) {
        summary.income += amount;
      } else {
        summary.expenses += Math.abs(amount);
      }
      summary.balance += amount;
      return summary;
    }, { income: 0, expenses: 0, balance: 0 });
  };

  const summary = calculateSummary();
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2 className="dashboard-title">Financial Dashboard</h2>
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>
      
      {loading && (
        <div className="loading-indicator">
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="loading-spinner">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="30 60" />
          </svg>
          Loading data...
        </div>
      )}
      
      {error && !loading && <div className="error-display">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      {/* Financial Summary Cards */}
      <div className="summary-container">
        <div className="summary-card">
          <div className="summary-title">Income</div>
          <div className="summary-amount positive">${summary.income.toFixed(2)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-title">Expenses</div>
          <div className="summary-amount negative">${summary.expenses.toFixed(2)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-title">Balance</div>
          <div className={`summary-amount ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
            ${Math.abs(summary.balance).toFixed(2)}
          </div>
        </div>
      </div>
      
      <div className="view-toggle">
        <button 
          className={`view-toggle-button ${viewSummary ? 'active' : ''}`}
          onClick={() => setViewSummary(true)}
        >
          Summary
        </button>
        <button 
          className={`view-toggle-button ${!viewSummary ? 'active' : ''}`}
          onClick={() => setViewSummary(false)}
        >
          Details
        </button>
      </div>
      
      <div className="main-layout-container">
        {/* Left Column - Chart */}
        <div className="left-column">
          {transactions.length > 0 && !loading && !error && (
            <TransactionChart transactions={transactions} darkMode={darkMode} />
          )}
        </div>
        
        {/* Center Column - Transactions List */}
        <div className="center-column">
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
        
        {/* Right Column - Add Transaction Form */}
        <div className="right-column">
          <form
            className="transaction-form"
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
                placeholder="Description"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                name="amount"
                type="number"
                step="0.01"
                placeholder="Amount"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                name="date"
                type="date"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <select
                name="category"
                required
                className="form-input category-select"
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
              className="form-button"
            >
              Add Transaction
            </button>
          </form>
          
          {/* Connect Bank Account Section */}
          <div className="plaid-section">
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
              className="form-button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M16 12L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M13 9L16 12L13 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;