import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tokenService } from '../../services/tokenService.js';
import { TokenCard } from '../../components/customer/TokenCard.jsx';
import { Loader } from '../../components/common/Loader.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { APP_ROUTES } from '../../constants/routes.js';

export const MyTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await tokenService.getMyTokens();
        if (response?.data?.tokens) {
          setTokens(response.data.tokens);
        }
      } catch (err) {
        console.warn('Error fetching user tokens:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTokens();
  }, []);

  if (loading) {
    return <Loader message="Retrieving your digital tokens..." />;
  }

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h1>My Digital Tokens</h1>
          <p>Review active and historical queue tokens issued to your account.</p>
        </div>
        <Link to={APP_ROUTES.CUSTOMER.WALK_IN} className="btn btn-primary btn-sm">
          + Get New Token
        </Link>
      </div>

      {tokens.length > 0 ? (
        <div className="grid-2">
          {tokens.map((token) => (
            <TokenCard key={token._id} token={token} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🎫"
          title="No tokens issued yet"
          description="You haven't requested any tokens yet. Choose an active desk to get started."
          actionText="Get Walk-In Token"
          onAction={() => (window.location.href = APP_ROUTES.CUSTOMER.WALK_IN)}
        />
      )}
    </div>
  );
};

export default MyTokens;
