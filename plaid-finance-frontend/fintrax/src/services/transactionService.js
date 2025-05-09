// Using environment variables for sensitive data
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Construct auth credentials from environment variables
const username = process.env.REACT_APP_AUTH_USERNAME || 'admin';
const password = process.env.REACT_APP_AUTH_PASSWORD || 'palmtree14';
const AUTH_CREDENTIALS = 'Basic ' + btoa(`${username}:${password}`);

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
  },

  async deleteTransaction(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': AUTH_CREDENTIALS,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      
      return true;
    }
    catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  async updateTransaction(id, transaction) {
    try {
      // Ensure amount is formatted with 2 decimal places
      const amount = parseFloat(parseFloat(transaction.amount).toFixed(2));
      
      // Map frontend fields to backend fields
      const requestBody = {
        name: transaction.name,
        amount: amount,
        date: transaction.date,
        category: transaction.category
      };
      
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'PUT',
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
      
      const updatedTransaction = await response.json();
      return updatedTransaction;
    }
    catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }
};