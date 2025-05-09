// Plaid API service for frontend
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
const AUTH_CREDENTIALS = 'Basic ' + btoa(`${process.env.REACT_APP_AUTH_USERNAME || 'admin'}:${process.env.REACT_APP_AUTH_PASSWORD || 'palmtree14'}`);

export const plaidService = {
  // Get a link token from our backend
  async getLinkToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/plaid/create-link-token`, {
        headers: {
          'Authorization': AUTH_CREDENTIALS,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      
      const data = await response.json();
      return data.link_token;
    } catch (error) {
      console.error('Error getting link token:', error);
      throw error;
    }
  },
  
  // Exchange public token for access token
  async setAccessToken(publicToken, metadata) {
    try {
      const response = await fetch(`${API_BASE_URL}/plaid/set-access-token`, {
        method: 'POST',
        headers: {
          'Authorization': AUTH_CREDENTIALS,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          public_token: publicToken,
          institution_id: metadata?.institution?.institution_id,
          institution_name: metadata?.institution?.name
        })
      });
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error setting access token:', error);
      throw error;
    }
  },
  
  // Get transactions for a specific item
  async getTransactions(itemId) {
    try {
      const response = await fetch(`${API_BASE_URL}/plaid/transactions/${itemId}`, {
        headers: {
          'Authorization': AUTH_CREDENTIALS,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }
};