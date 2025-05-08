const API_BASE_URL = 'http://localhost:8080/api';

// Load credentials from environment variables in a real application
// NEVER hardcode credentials in frontend code
const AUTH_CREDENTIALS = 'Basic ' + btoa('admin:palmtree14');

export const transactionService = {
  async getAllTransactions() {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        headers: {
          'Authorization': AUTH_CREDENTIALS,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      
      // Parse response as JSON
      const data = await response.json();
      
      // Validate data structure
      if (!Array.isArray(data)) {
        throw new Error('API returned unexpected data format');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  async addTransaction(transaction) {
    try {
      // Ensure amount is formatted with 2 decimal places
      const amount = parseFloat(parseFloat(transaction.amount).toFixed(2));
      
      // Map frontend fields to backend fields
      const requestBody = {
        name: transaction.description, // Map 'description' to 'name'
        amount: amount,
        date: transaction.date,
        category: transaction.category
      };
      
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_CREDENTIALS
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      
      const savedTransaction = await response.json();
      return savedTransaction;
    }
    catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }
};