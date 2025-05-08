import React from "react";
import "./TransactionList.css";

function TransactionList({ transactions, darkMode }) {
  // Format amount to always show 2 decimal places
  const formatAmount = (amount) => {
    return typeof amount === "number" ? amount.toFixed(2) : "0.00";
  };

  return (
    <div className="transaction-list-container">
      <h3 className="transaction-list-title">Transactions</h3>
      <table className={`transaction-table ${darkMode ? "dark-mode" : ""}`}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.name}</td>
              <td
                className={
                  transaction.amount < 0 ? "negative-amount" : "positive-amount"
                }
              >
                {transaction.amount < 0
                  ? `-$${formatAmount(Math.abs(transaction.amount))}`
                  : `$${formatAmount(transaction.amount)}`}
              </td>
              <td>{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;