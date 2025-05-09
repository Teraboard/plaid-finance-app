import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { plaidService } from '../services/plaidService';
import './PlaidLink.css';

function PlaidLinkButton({ onSuccess, darkMode }) {
  const [linkToken, setLinkToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await plaidService.getLinkToken();
        setLinkToken(token);
      } catch (err) {
        console.error('Error getting link token', err);
        setError('Failed to initialize bank connection. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    getToken();
  }, []);

  const onPlaidSuccess = useCallback(
    async (publicToken, metadata) => {
      setIsLoading(true);
      setError(null);
      try {
        const plaidItem = await plaidService.setAccessToken(publicToken, metadata);
        if (onSuccess) {
          onSuccess(plaidItem);
        }
      } catch (err) {
        console.error('Error in Plaid success callback', err);
        setError('Failed to link your bank account. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => onPlaidSuccess(public_token, metadata),
    onExit: (err) => {
      if (err != null) {
        console.error('Plaid Link exit with error', err);
      }
    },
  });

  return (
    <div className="plaid-link-container">
      <button
        onClick={() => open()}
        disabled={!ready || isLoading}
        className={`plaid-link-button ${darkMode ? 'dark-mode' : ''}`}
      >
        {isLoading ? 'Connecting...' : 'Connect Bank Account'}
      </button>
      {error && <div className="plaid-link-error">{error}</div>}
    </div>
  );
}

export default PlaidLinkButton;