'use client';

import { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useSwitchChain,
  useChainId,
  useDisconnect,
} from 'wagmi';
import { base } from 'wagmi/chains';
import { parseUnits } from 'viem';
import { PaymentService } from '@/lib/payment';

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const RECIPIENT_ADDRESS =
  process.env.NEXT_PUBLIC_BASE_BUILDER_ADDRESS ||
  '0x879e4a7d26a0b03D5Aa7b34c0F609cCA93071fD8';
const BASE_CHAIN_ID = base.id; // 8453

interface PaymentScreenProps {
  onPaymentComplete: () => void;
}

export function PaymentScreen({ onPaymentComplete }: PaymentScreenProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const [isPaying, setIsPaying] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [connectError, setConnectError] = useState<string | null>(null);
  const { sendTransaction } = useSendTransaction();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const isOnBase = chainId === BASE_CHAIN_ID;

  const handleConnectWallet = (connector: typeof connectors[number]) => {
    setConnectError(null);
    try {
      connect({ connector });
    } catch (error) {
      console.error('Connection failed:', error);
      setConnectError('Connection failed. Please try again.');
    }
  };

  useEffect(() => {
    if (isConfirmed && txHash) {
      PaymentService.markAsPaid();
      onPaymentComplete();
    }
  }, [isConfirmed, txHash, onPaymentComplete]);

  const handlePayment = async () => {
    if (!address) return;
    setIsPaying(true);
    try {
      const amount = parseUnits(
        PaymentService.getPaymentAmount().toString(),
        6
      );
      const transferData = `0xa9059cbb${RECIPIENT_ADDRESS.slice(2).padStart(64, '0')}${amount.toString(16).padStart(64, '0')}`;
      sendTransaction(
        {
          to: USDC_ADDRESS as `0x${string}`,
          data: transferData as `0x${string}`,
        },
        {
          onSuccess: (hash) => setTxHash(hash),
          onError: (error) => {
            console.error('Transaction failed:', error);
            alert(
              'Payment failed. Please make sure you have enough USDC and try again.'
            );
            setIsPaying(false);
          },
        }
      );
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
      setIsPaying(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '420px',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              fontSize: '64px',
              marginBottom: '12px',
              animation: 'bounce 1s infinite',
            }}
          >
            🐦
          </div>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#1f2937',
              marginBottom: '8px',
            }}
          >
            Flappy Bird
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            Pay once, play forever!
          </p>
        </div>

        {/* Price Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            color: 'white',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: '600' }}>
              🎮 Game Access
            </span>
            <span style={{ fontSize: '28px', fontWeight: '800' }}>
              ${PaymentService.getPaymentAmount()} USDC
            </span>
          </div>
          <p
            style={{
              marginTop: '8px',
              fontSize: '14px',
              opacity: 0.9,
            }}
          >
            One-time payment • Unlimited gameplay
          </p>
        </div>

        {/* Wallet Section */}
        {!isConnected ? (
          <div>
            <p
              style={{
                textAlign: 'center',
                color: '#6b7280',
                marginBottom: '16px',
                fontSize: '15px',
              }}
            >
              Connect your wallet to continue
            </p>
            
            {connectError && (
              <div
                style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  color: '#dc2626',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                {connectError}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {connectors.map((connector) => {
                const walletStyles: Record<string, { bg: string; icon: string }> = {
                  'Injected': { bg: 'linear-gradient(135deg, #f6851b 0%, #e2761b 100%)', icon: '🦊' },
                  'MetaMask': { bg: 'linear-gradient(135deg, #f6851b 0%, #e2761b 100%)', icon: '🦊' },
                  'Coinbase Wallet': { bg: 'linear-gradient(135deg, #0052FF 0%, #3b82f6 100%)', icon: '🔵' },
                  'WalletConnect': { bg: 'linear-gradient(135deg, #3b99fc 0%, #2d7dd2 100%)', icon: '🔗' },
                };
                const style = walletStyles[connector.name] || { bg: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', icon: '💼' };
                const displayName = connector.name === 'Injected' ? 'MetaMask / Browser' : connector.name;
                
                return (
                  <button
                    key={connector.uid}
                    onClick={() => handleConnectWallet(connector)}
                    disabled={isConnecting}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      background: isConnecting ? '#9ca3af' : style.bg,
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: isConnecting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      transition: 'transform 0.2s, opacity 0.2s',
                    }}
                    onMouseOver={(e) => {
                      if (!isConnecting) e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    {style.icon} {displayName}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            {/* Connected Status */}
            <div
              style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#10b981',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px',
                    }}
                  >
                    ✓
                  </div>
                  <div>
                    <p
                      style={{
                        fontWeight: '600',
                        color: '#065f46',
                        fontSize: '15px',
                      }}
                    >
                      Wallet Connected
                    </p>
                    <p
                      style={{
                        color: '#6b7280',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                      }}
                    >
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => disconnect()}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Disconnect
                </button>
              </div>
            </div>

            {/* Wrong Network Warning */}
            {!isOnBase && (
              <div
                style={{
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fcd34d',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                <p
                  style={{
                    fontWeight: '600',
                    color: '#92400e',
                    fontSize: '15px',
                    marginBottom: '12px',
                  }}
                >
                  ⚠️ Wrong Network
                </p>
                <p
                  style={{
                    color: '#a16207',
                    fontSize: '14px',
                    marginBottom: '12px',
                  }}
                >
                  Please switch to Base network to continue
                </p>
                <button
                  onClick={() => switchChain({ chainId: BASE_CHAIN_ID })}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  🔄 Switch to Base
                </button>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={isPaying || !!txHash || !isOnBase}
              style={{
                width: '100%',
                padding: '18px 24px',
                background:
                  isPaying || txHash || !isOnBase
                    ? '#9ca3af'
                    : 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: isPaying || txHash || !isOnBase ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseOver={(e) => {
                if (!isPaying && !txHash && isOnBase) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow =
                    '0 10px 25px rgba(245, 158, 11, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {txHash ? (
                <>
                  <span
                    style={{
                      animation: 'spin 1s linear infinite',
                      display: 'inline-block',
                    }}
                  >
                    ⏳
                  </span>
                  Confirming...
                </>
              ) : isPaying ? (
                <>
                  <span
                    style={{
                      animation: 'spin 1s linear infinite',
                      display: 'inline-block',
                    }}
                  >
                    🔄
                  </span>
                  Processing...
                </>
              ) : (
                <>💳 Pay ${PaymentService.getPaymentAmount()} USDC</>
              )}
            </button>

            {/* Transaction Link */}
            {txHash && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: '#eff6ff',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <p style={{ color: '#1e40af', fontSize: '14px' }}>
                  Transaction submitted!
                </p>
                <a
                  href={`https://basescan.org/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#3b82f6',
                    fontWeight: '600',
                    textDecoration: 'none',
                    fontSize: '14px',
                  }}
                >
                  View on BaseScan →
                </a>
              </div>
            )}

            {/* Security Note */}
            <p
              style={{
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '13px',
                marginTop: '16px',
              }}
            >
              🔒 Secure payment powered by Base
            </p>
          </div>
        )}

        {/* Features */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <p
            style={{
              fontWeight: '700',
              color: '#374151',
              marginBottom: '16px',
              fontSize: '16px',
            }}
          >
            What you get:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              '🎮 Unlimited gameplay',
              '🏆 Track your high scores',
              '👥 Compete with friends',
              '🚫 No ads, ever',
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#4b5563',
                  fontSize: '15px',
                }}
              >
                <span
                  style={{
                    color: '#10b981',
                    fontWeight: 'bold',
                    fontSize: '16px',
                  }}
                >
                  ✓
                </span>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
