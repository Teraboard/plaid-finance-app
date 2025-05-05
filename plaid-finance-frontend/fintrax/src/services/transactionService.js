const API_BASE_URL = 'http://localhost:8080/api';

export const transactionService = {
  async getAllTransactions() {
    try {
      console.log('Fetching all transactions...');
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:palmtree14'),
          'Content-Type': 'application/json'
        }
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Received transactions:', data);
      return data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  async addTransaction(transaction) {
    try {
      console.log('Sending transaction:', transaction);
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:palmtree14')
        },
        body: JSON.stringify({
          name: transaction.description,
          amount: transaction.amount,
          date: transaction.date,
          category: transaction.category // <-- use the selected category
        })
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Network response was not ok');
      }
      const savedTransaction = await response.json();
      console.log('Saved transaction:', savedTransaction);
      return savedTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }
};