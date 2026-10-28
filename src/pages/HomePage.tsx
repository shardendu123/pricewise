import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Star, ChevronRight, BarChart2, ShieldCheck, BookOpen, Zap, ArrowRight } from 'lucide-react';
import sampleProducts, { CATEGORIES, getTrendingProducts } from '../data/products';
import { Product } from '../data/products';
import ProductCard from '../components/ProductCard';

type Page = 'home' | 'explore' | 'compare' | 'price-intelligence' | 'reviews' | 'budget' | 'wishlist';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  onProductView: (product: Product) => void;
}

const FEATURES = [
  {
    icon: <BarChart2 size={22} />,
    title: 'Price Intelligence',
    desc: 'Track sample price trends across time. Understand if demo prices are high or low relative to history.',
    color: '#8b5cf6',
  },
  {
    icon: <Zap size={22} />,
    title: 'Product Comparison',
    desc: 'Compare up to 4 products side-by-side across price, specs, ratings, warranty, and features.',
    color: '#3b82f6',
  },
  {
    icon: <BookOpen size={22} />,
    title: 'Review Insights',
    desc: 'Summarize common themes from included sample reviews. Positive and negative sentiment at a glance.',
    color: '#06b6d4',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Budget Recommendations',
    desc: 'Enter your budget and get transparent product recommendations with documented value scores.',
    color: '#10b981',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Browse Products', desc: 'Explore our demo catalog of smartphones, laptops, headphones, and accessories.' },
  { step: '02', title: 'Compare & Analyse', desc: 'Add products to compare, view price history charts, and read sample review summaries.' },
  { step: '03', title: 'Make Smart Choices', desc: 'Use the budget tool and transparent value scores to pick the right product for you.' },
];

export default function HomePage({ onNavigate, onProductView }: HomePageProps) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const trending = getTrendingProducts(4);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const q = query.toLowerCase();
    setSearchResults(
      sampleProducts.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      ).slice(0, 5)
    );
  }, [query]);

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #060b18 0%, #0f1930 50%, #060b18 100%)',
          padding: '80px 16px 100px',
        }}
      >
        {/* Decorative glow blobs */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
            top: -200,
            left: -100,
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
            bottom: -150,
            right: -50,
          }}
        />

        <div className="max-w-3xl mx-auto text-center relative">
          <div className="flex justify-center mb-6">
            <span className="badge badge-violet px-4 py-1.5" style={{ fontSize: '0.78rem' }}>
              <Star size={12} /> Demo Application — Sample Data Only
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 800,
              color: '#f1f5f9',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              marginBottom: 20,
            }}
          >
            Shop Smarter.{' '}
            <span className="gradient-text">Save Better.</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: 580, margin: '0 auto 36px', lineHeight: 1.7 }}>
            PriceWise is a product intelligence platform that helps you compare prices, specifications,
            and reviews — so you always know you're getting the best value.
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto mb-8">
            <Search
              size={18}
              className="absolute"
              style={{ left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }}
            />
            <input
              id="hero-search"
              className="input-field"
              style={{ paddingLeft: '44px', height: '52px', fontSize: '1rem' }}
              placeholder="Search smartphones, laptops, headphones…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />

            {/* Inline search dropdown */}
            {searchResults.length > 0 && (
              <div
                className="absolute w-full mt-2 rounded-xl overflow-hidden z-50"
                style={{
                  background: 'rgba(10,16,32,0.97)',
                  border: '1px solid rgba(139,92,246,0.2)',
                  top: '100%',
                }}
              >
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors"
                    style={{ borderBottom: '1px solid rgba(139,92,246,0.08)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(139,92,246,0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    onClick={() => {
                      onProductView(p);
                      setQuery('');
                      setSearchResults([]);
                    }}
                  >
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#f1f5f9', fontWeight: 500 }}>{p.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#475569' }}>
                        {p.brand} · {p.currency}{p.currentPrice.toLocaleString()} (demo)
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button className="btn-primary" onClick={() => onNavigate('explore')} id="cta-explore">
              Explore Products <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('compare')} id="cta-compare">
              <Zap size={16} /> Compare Products
            </button>
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="section-title">Featured Categories</h2>
          <p className="section-subtitle">Explore demo products across popular tech categories</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              id={`cat-${cat.key}`}
              className="glass-card-hover p-6 text-center flex flex-col items-center gap-3"
              onClick={() => onNavigate('explore')}
              aria-label={`Browse ${cat.label}`}
            >
              <span style={{ fontSize: '2.5rem' }}>{cat.emoji}</span>
              <span style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.95rem' }}>{cat.label}</span>
              <span style={{ fontSize: '0.75rem', color: '#475569' }}>
                {sampleProducts.filter((p) => p.category === cat.key).length} products
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Trending Products ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={18} color="#8b5cf6" />
              <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Trending Products</h2>
            </div>
            <p className="section-subtitle">Most reviewed products in our demo dataset</p>
          </div>
          <button
            className="btn-ghost flex items-center gap-1"
            onClick={() => onNavigate('explore')}
            id="view-all-trending"
          >
            View all <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} onViewDetails={onProductView} />
          ))}
        </div>
      </section>

      <div className="divider max-w-7xl mx-auto" />

      {/* ── How It Works ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps to smarter shopping</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="glass-card p-8 text-center">
              <div
                className="mx-auto flex items-center justify-center rounded-2xl mb-5"
                style={{
                  width: 56,
                  height: 56,
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2))',
                  border: '1px solid rgba(139,92,246,0.3)',
                }}
              >
                <span style={{ fontSize: '1.1rem', fontWeight: 800, background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {item.step}
                </span>
              </div>
              <h3 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem', marginBottom: 8 }}>{item.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Cards ─────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(15,25,48,0.5), transparent)',
          padding: '0 16px 80px',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle">Powerful tools for informed purchasing decisions</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="glass-card-hover p-6">
                <div
                  className="flex items-center justify-center rounded-xl mb-4"
                  style={{
                    width: 44,
                    height: 44,
                    background: `${feat.color}22`,
                    border: `1px solid ${feat.color}44`,
                    color: feat.color,
                  }}
                >
                  {feat.icon}
                </div>
                <h3 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem', marginBottom: 6 }}>{feat.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.825rem', lineHeight: 1.6 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid rgba(139,92,246,0.1)',
          padding: '40px 16px',
          textAlign: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f1f5f9', marginBottom: 8 }}>
            Price<span className="gradient-text">Wise</span>
          </p>
          <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: 16 }}>
            A student portfolio project. All prices, reviews, and data are simulated demo content.
          </p>
          <div className="flex flex-wrap justify-center gap-6" style={{ marginBottom: 16 }}>
            {[
              { label: 'Home', page: 'home' as Page },
              { label: 'Explore', page: 'explore' as Page },
              { label: 'Compare', page: 'compare' as Page },
              { label: 'Insights', page: 'price-intelligence' as Page },
              { label: 'Budget', page: 'budget' as Page },
              { label: 'Wishlist', page: 'wishlist' as Page },
            ].map(({ label, page }) => (
              <button
                key={page}
                className="nav-link"
                style={{ fontSize: '0.825rem' }}
                onClick={() => onNavigate(page)}
              >
                {label}
              </button>
            ))}
          </div>
          <p style={{ color: '#334155', fontSize: '0.75rem' }}>
            © 2024 PriceWise · Built with React, Vite, TypeScript & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
