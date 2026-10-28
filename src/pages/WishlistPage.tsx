import React, { useState, useEffect } from 'react';
import { Heart, Trash2, GitCompare } from 'lucide-react';
import sampleProducts from '../data/products';
import { Product } from '../data/products';
import { getWishlist, removeFromWishlist } from '../utils/storage';
import ProductCard from '../components/ProductCard';

interface WishlistPageProps {
  onProductView: (product: Product) => void;
  onNavigateExplore: () => void;
  onWishlistChange: () => void;
}

export default function WishlistPage({ onProductView, onNavigateExplore, onWishlistChange }: WishlistPageProps) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    const load = () => setWishlistIds(getWishlist());
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  const products = wishlistIds
    .map((id) => sampleProducts.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  function handleRemove(id: string) {
    removeFromWishlist(id);
    setWishlistIds((prev) => prev.filter((x) => x !== id));
    onWishlistChange();
  }

  function handleClearAll() {
    wishlistIds.forEach((id) => removeFromWishlist(id));
    setWishlistIds([]);
    onWishlistChange();
  }

  if (products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="glass-card p-16">
          <Heart size={48} color="#f43f5e" style={{ margin: '0 auto 16px' }} />
          <h1 className="section-title mb-3">Your Wishlist is Empty</h1>
          <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: 28 }}>
            Start exploring products and click the{' '}
            <strong style={{ color: '#fb7185' }}>heart icon</strong> to save items you love.
          </p>
          <button className="btn-primary" onClick={onNavigateExplore} id="go-explore-from-wishlist">
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  const totalValue = products.reduce((sum, p) => sum + p.currentPrice, 0);
  const totalSavings = products.reduce(
    (sum, p) => sum + (p.originalPrice ? p.originalPrice - p.currentPrice : 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <Heart size={28} color="#f43f5e" fill="#f43f5e" />
            My Wishlist
          </h1>
          <p className="section-subtitle">
            {products.length} saved product{products.length !== 1 ? 's' : ''} · All prices are demo data
          </p>
        </div>
        <button className="btn-ghost text-sm" onClick={handleClearAll} id="clear-wishlist-btn">
          <Trash2 size={14} /> Clear all
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: 'Items saved',
            value: products.length,
            color: '#a78bfa',
          },
          {
            label: 'Total demo value',
            value: `₹${totalValue.toLocaleString()}`,
            color: '#60a5fa',
          },
          {
            label: 'Potential savings',
            value: totalSavings > 0 ? `₹${totalSavings.toLocaleString()}` : '—',
            color: '#34d399',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-4 flex items-center gap-4"
          >
            <div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 2 }}>{stat.label}</p>
              <p style={{ fontWeight: 700, fontSize: '1.3rem', color: stat.color }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product) => (
          <div key={product.id} className="relative">
            <ProductCard product={product} onViewDetails={onProductView} />
            {/* Remove overlay button */}
            <button
              className="absolute top-3 left-3 p-1.5 rounded-lg transition-all"
              style={{
                background: 'rgba(244,63,94,0.85)',
                border: '1px solid rgba(244,63,94,0.5)',
                color: 'white',
                zIndex: 10,
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(product.id);
              }}
              title="Remove from wishlist"
              aria-label={`Remove ${product.name} from wishlist`}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      <p
        style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#334155',
          marginTop: 32,
        }}
      >
        Wishlist is saved in your browser's local storage — it persists between sessions on this device.
      </p>
    </div>
  );
}
