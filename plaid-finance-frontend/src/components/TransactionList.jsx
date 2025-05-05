import React from 'react';

const TransactionList = ({ transactions }) => {
    return (
        <div>
            <h2>Transaction List</h2>
            <ul>
                {transactions.map((transaction, index) => (
                    <li key={index}>
                        <p><strong>Description:</strong> {transaction.description}</p>
                        <p><strong>Amount:</strong> ${transaction.amount}</p>
                        <p><strong>Date:</strong> {transaction.date}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionList;