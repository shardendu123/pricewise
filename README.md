# PriceWise — Smart Price & Product Intelligence Platform

> **A portfolio-grade student project.** All prices, reviews, and data are simulated demo content and do not represent live marketplace data.

---

## Overview

PriceWise is a fully client-side web application that helps online shoppers compare products by price, specifications, ratings, and overall value. Built as a complete React + TypeScript application with a premium dark UI.

## Features

| Feature | Description |
|---|---|
| 🔍 **Product Explorer** | Search, filter by category/rating/price, sort by value/price/rating |
| ⚖️ **Product Comparison** | Side-by-side comparison of up to 4 products with winner highlights |
| 📈 **Price Intelligence** | Sample price history charts with assessment (low/avg/high) |
| 💬 **Review Insights** | Keyword-extracted themes and sentiment from included sample reviews |
| 💸 **Budget Recommendations** | Transparent scoring with documented criteria |
| ❤️ **Wishlist** | Add/remove favourites, persisted in LocalStorage |

## Tech Stack

- **React 18** — UI framework
- **Vite 8** — Build tool and dev server
- **TypeScript** — Type safety throughout
- **Tailwind CSS v4** — Styling via the Vite plugin
- **Lucide React** — Icon library
- **Recharts** — Price history area charts

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx              # Sticky navigation bar
│   ├── ProductCard.tsx         # Product grid card
│   └── ProductDetailModal.tsx  # Full-screen product details
├── pages/
│   ├── HomePage.tsx            # Landing page with hero & trending
│   ├── ExplorePage.tsx         # Product search & filter grid
│   ├── ComparePage.tsx         # Side-by-side comparison table
│   ├── PriceIntelligencePage.tsx # Price history charts & alerts
│   ├── ReviewInsightsPage.tsx  # Review themes & sentiment
│   ├── BudgetPage.tsx          # Budget-based recommendations
│   └── WishlistPage.tsx        # Saved products wishlist
├── data/
│   └── products.ts             # 12 demo products with full metadata
├── utils/
│   └── storage.ts              # LocalStorage helpers (wishlist, compare, alerts)
├── App.tsx                     # Root app with page-based routing
├── main.tsx                    # React entry point
└── index.css                   # Global styles & design tokens
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/pricewise.git
cd pricewise

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173/pricewise/](http://localhost:5173/pricewise/) in your browser.

### Build for Production

```bash
npm run build
```

The output is placed in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## GitHub Pages Deployment

1. Push to a GitHub repository named `pricewise`

2. Install the GitHub Pages deploy tool:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add to `package.json` scripts:
   ```json
   "deploy": "gh-pages -d dist"
   ```

4. Build and deploy:
   ```bash
   npm run build && npm run deploy
   ```

5. In your GitHub repository settings → Pages, set source to the `gh-pages` branch.

> The `base: '/pricewise/'` in `vite.config.ts` is already configured for this deployment path.

## Demo Data Disclaimer

All product names, prices, ratings, specifications, and reviews in this project are **simulated demo content** created for educational and portfolio purposes. They:

- Do **not** represent live marketplace prices
- Are **not** verified customer reviews
- Do **not** guarantee the accuracy of any specification

## License

MIT — see [LICENSE](LICENSE) for details.

---

*Built with ❤️ as a computer science portfolio project.*
