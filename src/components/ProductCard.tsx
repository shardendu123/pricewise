import React, { useState, useEffect } from 'react';
import { Heart, GitCompare, Star, TrendingDown, ShieldCheck } from 'lucide-react';
import { Product } from '../data/products';
import {
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  addToCompare,
  isInCompare,
  removeFromCompare,
} from '../utils/storage';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  compact?: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="star-rating" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="12" height="12" viewBox="0 0 12 12" fill={s <= Math.round(rating) ? '#fbbf24' : 'none'}>
          <polygon
            points="6,1 7.5,4.5 11,4.8 8.5,7 9.3,10.5 6,8.7 2.7,10.5 3.5,7 1,4.8 4.5,4.5"
            stroke="#fbbf24"
            strokeWidth="0.8"
          />
        </svg>
      ))}
    </span>
  );
}

export default function ProductCard({ product, onViewDetails, compact = false }: ProductCardProps) {
  const [wished, setWished] = useState(false);
  const [compared, setCompared] = useState(false);
  const [compareError, setCompareError] = useState('');

  useEffect(() => {
    setWished(isInWishlist(product.id));
    setCompared(isInCompare(product.id));
  }, [product.id]);

  function toggleWish(e: React.MouseEvent) {
    e.stopPropagation();
    if (wished) {
      removeFromWishlist(product.id);
      setWished(false);
    } else {
      addToWishlist(product.id);
      setWished(true);
    }
  }

  function toggleCompare(e: React.MouseEvent) {
    e.stopPropagation();
    if (compared) {
      removeFromCompare(product.id);
      setCompared(false);
    } else {
      const ok = addToCompare(product.id);
      if (ok) {
        setCompared(true);
      } else {
        setCompareError('Max 4 products in compare');
        setTimeout(() => setCompareError(''), 3000);
      }
    }
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)
    : 0;

  const categoryColor: Record<string, string> = {
    smartphones: 'badge-violet',
    laptops: 'badge-blue',
    headphones: 'badge-emerald',
    accessories: 'badge-amber',
  };

  return (
    <div
      className="glass-card-hover flex flex-col cursor-pointer overflow-hidden group"
      onClick={() => onViewDetails?.(product)}
      role="article"
      aria-label={`${product.name} by ${product.brand}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onViewDetails?.(product)}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: compact ? '160px' : '200px' }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className={`badge ${categoryColor[product.category]}`}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </span>
          {discount > 0 && (
            <span className="badge badge-rose">
              <TrendingDown size={10} /> {discount}% OFF
            </span>
          )}
        </div>

        {/* Value Score */}
        <div className="absolute top-3 right-3">
          <div
            className="flex flex-col items-center justify-center rounded-xl text-center px-2 py-1"
            style={{
              background: 'rgba(10,16,32,0.85)',
              border: '1px solid rgba(139,92,246,0.3)',
            }}
          >
            <span style={{ fontSize: '0.65rem', color: '#a78bfa', fontWeight: 600, lineHeight: 1 }}>
              VALUE
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2 }}>
              {product.valueScore}
            </span>
          </div>
        </div>

        {/* Wishlist / Compare actions */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            className="p-1.5 rounded-lg transition-all"
            style={{
              background: wished ? 'rgba(244,63,94,0.3)' : 'rgba(10,16,32,0.7)',
              border: `1px solid ${wished ? 'rgba(244,63,94,0.5)' : 'rgba(139,92,246,0.3)'}`,
              color: wished ? '#fb7185' : '#94a3b8',
            }}
            onClick={toggleWish}
            title={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={14} fill={wished ? 'currentColor' : 'none'} />
          </button>
          <button
            className="p-1.5 rounded-lg transition-all"
            style={{
              background: compared ? 'rgba(139,92,246,0.3)' : 'rgba(10,16,32,0.7)',
              border: `1px solid ${compared ? 'rgba(139,92,246,0.6)' : 'rgba(139,92,246,0.3)'}`,
              color: compared ? '#a78bfa' : '#94a3b8',
            }}
            onClick={toggleCompare}
            title={compared ? 'Remove from compare' : 'Add to compare'}
            aria-label={compared ? 'Remove from compare' : 'Add to compare'}
          >
            <GitCompare size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div>
          <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {product.brand}
          </p>
          <h3 style={{ fontSize: compact ? '0.875rem' : '0.95rem', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.3, marginTop: '2px' }}>
            {product.name}
          </h3>
        </div>

        {!compact && (
          <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
            {product.shortDescription}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span style={{ fontSize: '0.8rem', color: '#f1f5f9', fontWeight: 600 }}>{product.rating}</span>
          <span style={{ fontSize: '0.75rem', color: '#475569' }}>({product.reviewCount.toLocaleString()} demo reviews)</span>
        </div>

        {/* Key specs (non-compact) */}
        {!compact && (
          <div className="flex flex-wrap gap-1 mt-1">
            {product.keyFeatures.slice(0, 3).map((feat) => (
              <span key={feat} className="tag-pill">{feat}</span>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price row */}
        <div className="flex items-end justify-between mt-2 pt-3" style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}>
          <div>
            <p style={{ fontSize: '0.7rem', color: '#475569', marginBottom: '2px' }}>Demo price</p>
            <div className="flex items-baseline gap-2">
              <span className="price-tag">
                {product.currency}{product.currentPrice.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="price-original">
                  {product.currency}{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1" style={{ fontSize: '0.72rem', color: '#10b981' }}>
            <ShieldCheck size={12} />
            <span>{product.inStock ? 'In stock' : 'Out of stock'}</span>
          </div>
        </div>

        {compareError && (
          <p style={{ fontSize: '0.75rem', color: '#fb7185', marginTop: '4px' }}>{compareError}</p>
        )}
      </div>
    </div>
  );
}
