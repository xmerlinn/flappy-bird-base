# Flappy Bird - Payment Integration

## 💰 How It Works

This Flappy Bird game uses a simple **pay-once-play-forever** model:

1. **Connect Wallet** - Users connect their Base wallet
2. **Pay 0.01 USDC** - One-time payment to unlock the game
3. **Play Forever** - Unlimited gameplay after payment

## 🔧 Technical Details

### Payment Flow

1. User connects wallet using OnchainKit's `ConnectWallet`
2. User clicks "Pay 0.01 USDC" button
3. Transaction is sent to Base mainnet USDC contract
4. Payment is transferred to your wallet address
5. Transaction is confirmed on-chain
6. Game is unlocked (stored in localStorage)

### Smart Contract Details

- **USDC Contract (Base Mainnet)**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Payment Amount**: 0.01 USDC (10,000 units with 6 decimals)
- **Recipient Address**: Set in `.env.local` as `NEXT_PUBLIC_BASE_BUILDER_ADDRESS`

### Code Structure

```
lib/payment/
  ├── paymentService.ts    # Payment logic and localStorage management
  └── index.ts

components/
  └── PaymentScreen.tsx    # Payment UI with wallet connection
```

## 🚀 Setup

### 1. Configure Recipient Address

Update `.env.local` with your wallet address:

```bash
NEXT_PUBLIC_BASE_BUILDER_ADDRESS=0xYourWalletAddress
```

### 2. Test Payment Flow

**Development (Localhost):**
```bash
npm run dev
```

Visit http://localhost:3000

**Important:** For testing, you can use Base Sepolia testnet USDC:
- Sepolia USDC: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- Get testnet USDC from faucets

### 3. Production Deployment

Deploy to Vercel or your preferred hosting:

```bash
npm run build
npm start
```

## 🧪 Testing

### Test Payment (Without Real USDC)

For development/testing, you can temporarily bypass payment:

```typescript
// In PaymentService.ts, add:
static bypassPayment() {
  this.markAsPaid();
}
```

Then call it from browser console:
```javascript
PaymentService.bypassPayment()
```

### Reset Payment Status

To test the payment flow again:

```javascript
localStorage.removeItem('flappy_bird_payment_made')
```

Or use the service method:
```javascript
PaymentService.resetPayment()
```

## 📊 Transaction Tracking

Users can view their transaction on BaseScan:
- Transaction link is shown after payment
- Format: `https://basescan.org/tx/{txHash}`

## 🔒 Security Notes

1. **No Backend Validation**: Payment is verified client-side only
   - Payment status is stored in localStorage
   - Users can bypass by clearing localStorage
   - For production, consider adding backend verification

2. **Recommended Improvements**:
   - Add backend API to verify transaction on-chain
   - Store payment status in database linked to wallet address
   - Check transaction amount and recipient match expected values

## 💡 Future Enhancements

### Option 1: Backend Verification
```typescript
// After transaction confirms, verify on backend
const response = await fetch('/api/verify-payment', {
  method: 'POST',
  body: JSON.stringify({ txHash, walletAddress })
});
```

### Option 2: NFT-Based Access
- Mint an NFT as proof of payment
- Check NFT ownership instead of localStorage
- More secure and transferable

### Option 3: Subscription Model
- Accept recurring payments
- Time-based access (e.g., monthly)
- Use smart contract for subscription logic

## 🎮 User Experience

### Payment Screen Features:
- ✅ Clean, modern UI
- ✅ Wallet connection with OnchainKit
- ✅ Real-time transaction status
- ✅ BaseScan link for verification
- ✅ Loading states and error handling
- ✅ Feature list (unlimited gameplay, no ads, etc.)

### After Payment:
- ✅ Automatic redirect to game
- ✅ Onboarding tutorial (first-time users)
- ✅ Persistent access (localStorage)
- ✅ No additional payments required

## 📝 Notes

- Payment is stored in localStorage (client-side only)
- Users need 0.01 USDC + gas fees in their wallet
- Transaction typically confirms in 2-5 seconds on Base
- Game unlocks immediately after confirmation

## 🐛 Troubleshooting

**"Payment failed" error:**
- Check user has enough USDC balance
- Check user has enough ETH for gas
- Verify USDC contract address is correct
- Check wallet is connected to Base mainnet

**Payment not unlocking game:**
- Check transaction confirmed on BaseScan
- Verify `isConfirmed` hook is working
- Check localStorage for payment flag
- Try refreshing the page

**Testing on testnet:**
- Update USDC_ADDRESS to Sepolia USDC contract
- Get testnet USDC from faucet
- Get testnet ETH for gas
