# Rainum Explorer V2

The official blockchain explorer for the Rainum network. Built from scratch with modern web technologies for optimal performance and user experience.

## Features

### CRH (Cross Reference Highlight)
- **Gold badge with dotted border** appears when hovering over wallet addresses
- **All instances of the same address** highlight simultaneously across the page
- Animated pulsing glow effect for better visibility

### Dashboard
- Real-time network statistics (Block Height, TPS, Total Transactions, Active Validators)
- Recent blocks list (auto-updates every 5 seconds)
- Recent transactions list (auto-updates every 3 seconds)
- Clean, gradient card-based layout

### Detail Pages
- **Block Details** (`/block/[hash]`) - Full block information with all transactions
- **Transaction Details** (`/transaction/[hash]`) - TX info with visual flow diagram showing sender → receiver
- **Account Profile** (`/account/[address]`) - Complete account overview with full transaction history

### List Pages
- **All Blocks** (`/blocks`) - Browse all blocks with pagination
- **All Transactions** (`/transactions`) - View all transactions with CRH hover support
- **Validators** (`/validators`) - Active and jailed validators with tier badges (Bronze, Silver, Gold, Platinum)

### Search Functionality
- Universal search in header navigation
- Auto-detects: block ID, block hash, transaction hash, or account address
- Smart redirect to appropriate detail page
- Helpful search examples on results page

## Tech Stack

- **Next.js 15** - App Router with Turbopack
- **TypeScript** - Full type safety
- **TailwindCSS** - Utility-first styling
- **TanStack Query** - Data fetching & caching
- **React Hot Toast** - Notifications
- **IBM Plex Sans** - Professional typography
- **Lucide React** - Beautiful icons

## Design System

- **Primary Color:** `#0019ff` (Rainum Blue)
- **Typography:** IBM Plex Sans (weights: 400, 500, 600, 700)
- **Responsive:** Mobile-first design with breakpoints for tablet and desktop

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
rainum-explorer-v2/
├── app/                          # Next.js App Router pages
│   ├── account/[address]/        # Account profile
│   ├── block/[hash]/             # Block details
│   ├── transaction/[hash]/       # Transaction details
│   ├── blocks/                   # Blocks list
│   ├── transactions/             # Transactions list
│   ├── validators/               # Validators list
│   └── search/                   # Search results
├── components/
│   ├── layout/                   # Header, Footer
│   └── shared/                   # AddressBadge (with CRH)
├── lib/
│   ├── api/                      # API client (rainum-api.ts)
│   ├── utils/                    # Format helpers
│   └── types/                    # TypeScript interfaces
└── public/                       # Static assets
```

## Key Components

### AddressBadge
Reusable component for displaying wallet addresses with:
- CRH (Cross Reference Highlight) on hover
- Copy to clipboard button
- Short/long address display modes
- Optional link to account page

### Header
Top navigation with:
- Rainum logo and branding
- Links to Blocks, Transactions, Validators
- Universal search bar

### Footer
Bottom navigation with links to resources and social media

## API Integration

Connects to Rainum blockchain node at `http://localhost:8080`

Main endpoints:
- `/status` - Network statistics
- `/blocks` - Block list
- `/block/:hash` - Block details
- `/transactions` - Transaction list
- `/transaction/:hash` - Transaction details
- `/account/:address` - Account info
- `/validators` - Validator list

## Development

Built with hot module replacement for instant updates during development.

### Key Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features in Detail

### Real-Time Updates
- Dashboard stats refresh every 10 seconds
- Recent blocks refresh every 5 seconds
- Recent transactions refresh every 3 seconds
- Uses TanStack Query for efficient caching

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Optimized layouts for all screen sizes

### Loading States
- Skeleton loaders for better perceived performance
- Smooth transitions and animations
- Empty states with helpful messages

## Contributing

This project is part of the Rainum blockchain ecosystem.

## License

© 2025 Rainum. All rights reserved.
