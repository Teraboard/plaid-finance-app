import React from 'react';
import TransactionList from '../components/TransactionList';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <h1>Financial Transactions</h1>
            <TransactionList />
        </div>
    );
};

export default Dashboard;