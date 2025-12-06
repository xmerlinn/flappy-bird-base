# 🐦 Flappy Bird - Base Mini App

A simple Flappy Bird game built on Base blockchain with a pay-once-play-forever model.

## 🎮 Features

- **Simple Payment Gate**: Connect wallet → Pay 0.01 USDC → Play forever
- **Real USDC Payments**: Integrated with Base mainnet USDC contract
- **Responsive Design**: Optimized for mobile devices
- **Dark/Light Mode**: Automatic theme detection
- **Offline Support**: Play even without internet connection
- **High Score Tracking**: Local high score persistence
- **Onboarding Tutorial**: First-time user guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` file:

```bash
# Your wallet address to receive payments
NEXT_PUBLIC_BASE_BUILDER_ADDRESS=0xYourWalletAddress

# Coinbase Developer Platform credentials
NEXT_PUBLIC_CDP_PROJECT_ID=your_project_id
NEXT_PUBLIC_CDP_API_KEY_ID=your_api_key_id

# Sentry (optional)
SENTRY_AUTH_TOKEN=your_sentry_token
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 4. Build for Production

```bash
npm run build
npm start
```

## 💰 Payment Integration

- **USDC Contract**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` (Base mainnet)
- **Payment Amount**: 0.01 USDC
- **Payment Storage**: Client-side (localStorage)

See [PAYMENT_README.md](./PAYMENT_README.md) for detailed payment integration docs.

## 🎨 Assets

The app requires the following assets for Farcaster manifest:

- Icon: 1024×1024px
- Cover: 1200×630px
- Screenshots: 1284×2778px

See [ASSETS_README.md](./ASSETS_README.md) for asset requirements.

## 🧪 Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## 📁 Project Structure

```
flappy-bird-base/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Main app with payment gate
│   └── layout.tsx           # Root layout with providers
├── components/              # React components
│   ├── game/               # Game components
│   │   └── GameCanvas.tsx  # Main game canvas
│   ├── PaymentScreen.tsx   # Payment UI
│   └── OnboardingModal.tsx # Tutorial modal
├── lib/                     # Core logic
│   ├── game/               # Game engine
│   ├── payment/            # Payment service
│   ├── store/              # Zustand stores
│   └── hooks/              # Custom hooks
└── public/                  # Static assets
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Blockchain**: Base (Coinbase L2)
- **Wallet**: OnchainKit + Wagmi
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **Monitoring**: Sentry
- **Type Safety**: TypeScript

## 🔧 Development

### Key Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm test             # Run tests
npm run lint         # Lint code
```

### Environment Variables

Required:
- `NEXT_PUBLIC_BASE_BUILDER_ADDRESS` - Your wallet for receiving payments
- `NEXT_PUBLIC_CDP_PROJECT_ID` - Coinbase Developer Platform project ID
- `NEXT_PUBLIC_CDP_API_KEY_ID` - CDP API key

Optional:
- `SENTRY_AUTH_TOKEN` - For error monitoring

## 📝 Documentation

- [Payment Integration](./PAYMENT_README.md) - Payment flow and setup
- [Assets Guide](./ASSETS_README.md) - Required assets for Farcaster

## 🎯 Game Controls

- **Desktop**: Click or press Spacebar to flap
- **Mobile**: Tap screen to flap
- **Goal**: Navigate through pipes without hitting them

## 🔒 Security Notes

⚠️ **Current Implementation**: Payment verification is client-side only (localStorage). For production, consider:

1. Backend verification of transactions
2. Database storage of payment status
3. NFT-based access control
4. Smart contract subscription model

See [PAYMENT_README.md](./PAYMENT_README.md) for security recommendations.

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📚 Learn More

- [OnchainKit Documentation](https://docs.base.org/onchainkit)
- [Next.js Documentation](https://nextjs.org/docs)
- [Base Documentation](https://docs.base.org)
- [Wagmi Documentation](https://wagmi.sh)
