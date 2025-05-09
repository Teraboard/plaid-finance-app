import React, { useState } from "react";
import "./TransactionList.css";

function TransactionList({ transactions, darkMode, onDeleteTransaction, onEditTransaction }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    amount: 0,
    date: "",
    category: ""
  });

  // Format amount to always show 2 decimal places
  const formatAmount = (amount) => {
    return typeof amount === "number" ? Math.abs(amount).toFixed(2) : "0.00";
  };

  const startEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      name: transaction.name,
      amount: transaction.amount,
      date: transaction.date,
      category: transaction.category
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleEditSubmit = (id) => {
    onEditTransaction(id, editForm);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === "amount" ? parseFloat(value) : value
    });
  };

  // Handle key press for Enter key
  const handleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      handleEditSubmit(id);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="transaction-list-container">
        <h3 className="transaction-list-title">Transactions</h3>
        <div className="no-transactions">No transactions to display</div>
      </div>
    );
  }

  return (
    <div className="transaction-list-container">
      <h3 className="transaction-list-title">Transactions</h3>
      <div className="transaction-table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                {editingId === transaction.id ? (
                  // Edit mode
                  <>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleChange}
                        onKeyPress={(e) => handleKeyPress(e, transaction.id)}
                        className="edit-input"
                        autoFocus
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="amount"
                        value={editForm.amount}
                        onChange={handleChange}
                        onKeyPress={(e) => handleKeyPress(e, transaction.id)}
                        step="0.01"
                        className="edit-input"
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="date"
                        value={editForm.date}
                        onChange={handleChange}
                        onKeyPress={(e) => handleKeyPress(e, transaction.id)}
                        className="edit-input"
                      />
                    </td>
                    <td className="action-buttons">
                      <button
                        className="save-button"
                        onClick={() => handleEditSubmit(transaction.id)}
                        title="Save changes"
                      >
                        Save
                      </button>
                      <button
                        className="cancel-button"
                        onClick={cancelEdit}
                        title="Cancel editing"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  // Display mode
                  <>
                    <td>{transaction.name}</td>
                    <td
                      className={
                        transaction.amount < 0 ? "negative-amount" : "positive-amount"
                      }
                    >
                      {transaction.amount < 0
                        ? `-$${formatAmount(transaction.amount)}`
                        : `$${formatAmount(transaction.amount)}`}
                    </td>
                    <td>{transaction.date}</td>
                    <td className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => startEdit(transaction)}
                        title="Edit transaction"
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => onDeleteTransaction(transaction.id)}
                        title="Delete transaction"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionList;