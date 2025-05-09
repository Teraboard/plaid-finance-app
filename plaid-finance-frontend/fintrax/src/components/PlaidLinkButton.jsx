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
        className="plaid-link-button"
      >
        <span className="plaid-link-icon">
          {isLoading ? (
            <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="loading-spinner">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="30 60">
                <animateTransform 
                  attributeName="transform" 
                  attributeType="XML" 
                  type="rotate"
                  dur="1s" 
                  from="0 12 12"
                  to="360 12 12" 
                  repeatCount="indefinite" />
              </circle>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z" fill="currentColor"/>
            </svg>
          )}
        </span>
        {isLoading ? 'Connecting...' : 'Connect Bank Account'}
      </button>
      {error && <div className="plaid-link-error">{error}</div>}
    </div>
  );
}

export default PlaidLinkButton;