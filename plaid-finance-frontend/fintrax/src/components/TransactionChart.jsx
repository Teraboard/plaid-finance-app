import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './TransactionChart.css';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Color palette for the chart
const CHART_COLORS = {
  GROCERIES: '#4bc0c0',
  UTILITIES: '#36a2eb',
  ENTERTAINMENT: '#ff6384',
  TRANSPORTATION: '#ffcd56',
  DINING: '#ff9f40',
  SHOPPING: '#9966ff',
  HEALTHCARE: '#c9cbcf',
  HOUSING: '#4d5360',
  INCOME: '#7ceb7c',
  SAVINGS: '#5d9cec',
  OTHER: '#f7464a',
  UNCATEGORIZED: '#949FB1'
};

const TransactionChart = ({ transactions, darkMode }) => {
  // Process transactions data for the chart
  const chartData = useMemo(() => {
    // Skip processing if we don't have transactions
    if (!transactions || transactions.length === 0) {
      return null;
    }

    // Group transactions by category and sum amounts
    const categoryTotals = transactions.reduce((acc, transaction) => {
      const category = transaction.category || 'UNCATEGORIZED';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;
      return acc;
    }, {});

    // Prepare data for the chart
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const backgroundColor = labels.map(label => CHART_COLORS[label] || '#949FB1');

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor: darkMode ? '#2c2c2c' : '#ffffff',
          borderWidth: 1,
        },
      ],
    };
  }, [transactions, darkMode]);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: darkMode ? '#ffffff' : '#333333',
          font: {
            size: 10
          },
          boxWidth: 10,
          padding: 5
        }
      },
      tooltip: {
        titleFont: { size: 10 },
        bodyFont: { size: 10 },
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw.toFixed(2);
            return `${label}: $${value}`;
          }
        }
      }
    }
  };

  if (!chartData) {
    return <div className="no-data-message">No transaction data available for chart</div>;
  }

  return (
    <div className={`chart-container ${darkMode ? "dark-mode" : ""}`}>
      <h3 className="chart-title">Transaction Breakdown</h3>
      <div className="chart-wrapper">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TransactionChart;
