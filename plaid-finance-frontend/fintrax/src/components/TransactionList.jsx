import React from "react";
import "./TransactionList.css";

function TransactionList({ transactions, darkMode }) {
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
              <td>{transaction.description}</td>
              <td
                className={
                  transaction.amount < 0 ? "negative-amount" : "positive-amount"
                }
              >
                {transaction.amount < 0
                  ? `-$${Math.abs(transaction.amount)}`
                  : `$${transaction.amount}`}
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