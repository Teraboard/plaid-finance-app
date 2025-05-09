import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './TransactionChart.css';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

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
      // Only count expenses (negative amounts)
      if (transaction.amount < 0) {
        acc[category] += Math.abs(transaction.amount);
      }
      return acc;
    }, {});

    // Remove categories with zero total
    Object.keys(categoryTotals).forEach(key => {
      if (categoryTotals[key] === 0) {
        delete categoryTotals[key];
      }
    });

    // Prepare data for the chart
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    
    // Use CSS variables for colors
    const backgroundColor = labels.map(label => 
      getComputedStyle(document.documentElement).getPropertyValue(`--chart-category-${label}`) || 
      getComputedStyle(document.documentElement).getPropertyValue('--chart-category-OTHER')
    );

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor: darkMode ? '#000000' : '#ffffff',
          borderWidth: 2,
          hoverOffset: 15,
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
          color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
          font: {
            size: 9,
            family: 'var(--font-family)'
          },
          boxWidth: 8,
          padding: 5,
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return chart.data.labels.map((label, i) => {
              const value = datasets[0].data[i];
              const total = datasets[0].data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              
              return {
                text: `${label} - $${value.toFixed(2)} (${percentage}%)`,
                fillStyle: datasets[0].backgroundColor[i],
                hidden: false,
                index: i
              };
            });
          }
        }
      },
      tooltip: {
        titleFont: { size: 12, family: 'var(--font-family)' },
        bodyFont: { size: 12, family: 'var(--font-family)' },
        backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
        bodyColor: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
        borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw.toFixed(2);
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${label}: $${value} (${percentage}%)`;
          }
        }
      }
    },
    layout: {
      padding: 15
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  if (!chartData) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">Expense Breakdown</h3>
        <div className="no-data-message">No expense data available for chart</div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">Expense Breakdown</h3>
      <div className="chart-wrapper">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TransactionChart;
