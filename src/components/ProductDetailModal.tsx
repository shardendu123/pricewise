import React, { useState, useEffect, useCallback } from 'react'
import {
  X, Heart, GitCompare, Star, ShieldCheck, TrendingDown,
  BarChart2, MessageSquare, ExternalLink, ChevronRight, Info
} from 'lucide-react'
import { Product } from '../data/products'
import {
  addToWishlist, removeFromWishlist, isInWishlist,
  addToCompare, removeFromCompare, isInCompare,
} from '../utils/storage'

interface ProductDetailModalProps {
  product: Product
  onClose: () => void
  onNavigatePriceIntel: () => void
  onNavigateReviews: () => void
  onWishlistChange: () => void
  onCompareChange: () => void
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="star-rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 12 12" fill={s <= Math.round(rating) ? '#fbbf24' : 'none'}>
          <polygon
            points="6,1 7.5,4.5 11,4.8 8.5,7 9.3,10.5 6,8.7 2.7,10.5 3.5,7 1,4.8 4.5,4.5"
            stroke="#fbbf24"
            strokeWidth="0.8"
          />
        </svg>
      ))}
    </span>
  )
}

export default function ProductDetailModal({
  product,
  onClose,
  onNavigatePriceIntel,
  onNavigateReviews,
  onWishlistChange,
  onCompareChange,
}: ProductDetailModalProps) {
  const [wished, setWished] = useState(false)
  const [compared, setCompared] = useState(false)
  const [compareErr, setCompareErr] = useState('')

  useEffect(() => {
    setWished(isInWishlist(product.id))
    setCompared(isInCompare(product.id))
    // Lock body scroll
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [product.id])

  // Close on Escape
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose]
  )
  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  function toggleWish() {
    if (wished) { removeFromWishlist(product.id); setWished(false) }
    else { addToWishlist(product.id); setWished(true) }
    onWishlistChange()
  }

  function toggleCompare() {
    if (compared) { removeFromCompare(product.id); setCompared(false) }
    else {
      const ok = addToCompare(product.id)
      if (ok) setCompared(true)
      else {
        setCompareErr('Max 4 products in compare list')
        setTimeout(() => setCompareErr(''), 3000)
      }
    }
    onCompareChange()
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)
    : 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={`Product details: ${product.name}`}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          background: 'rgba(10,16,32,0.98)',
          border: '1px solid rgba(139,92,246,0.25)',
        }}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-10 p-2 rounded-xl"
          style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)', color: '#94a3b8' }}
          onClick={onClose}
          aria-label="Close product details"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left — Image */}
          <div className="relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full object-cover"
              style={{ height: 320, borderRadius: '16px 0 0 0' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" style={{ borderRadius: '16px 0 0 0' }} />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <span className="badge badge-violet">{product.category}</span>
              {discount > 0 && (
                <span className="badge badge-rose">
                  <TrendingDown size={10} /> {discount}% off
                </span>
              )}
            </div>
            {/* Value Score */}
            <div className="absolute bottom-4 left-4">
              <div
                className="px-3 py-1.5 rounded-xl"
                style={{ background: 'rgba(10,16,32,0.85)', border: '1px solid rgba(139,92,246,0.3)' }}
              >
                <span style={{ fontSize: '0.7rem', color: '#a78bfa', fontWeight: 600 }}>VALUE SCORE</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{product.valueScore}</div>
              </div>
            </div>
          </div>

          {/* Right — Info */}
          <div className="p-6 flex flex-col gap-4">
            <div>
              <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {product.brand}
              </p>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2, marginTop: 4 }}>
                {product.name}
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 6, lineHeight: 1.6 }}>
                {product.shortDescription}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <StarRating rating={product.rating} />
              <span style={{ fontWeight: 700, color: '#f1f5f9' }}>{product.rating}</span>
              <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                ({product.reviewCount.toLocaleString()} demo reviews)
              </span>
            </div>

            {/* Price */}
            <div className="p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}>
              <p style={{ fontSize: '0.7rem', color: '#475569', marginBottom: 2 }}>Demo price (not a live listing)</p>
              <div className="flex items-baseline gap-3">
                <span className="price-tag">{product.currency}{product.currentPrice.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="price-original">{product.currency}{product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1" style={{ fontSize: '0.72rem', color: '#10b981' }}>
                <ShieldCheck size={11} /> {product.warranty}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                className="flex-1 btn-primary"
                style={{ justifyContent: 'center' }}
                onClick={toggleWish}
                id={`modal-wishlist-${product.id}`}
              >
                <Heart size={15} fill={wished ? 'currentColor' : 'none'} />
                {wished ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
              <button
                className="btn-secondary"
                style={{ flex: '0 0 auto', padding: '10px 16px' }}
                onClick={toggleCompare}
                id={`modal-compare-${product.id}`}
                title={compared ? 'Remove from compare' : 'Add to compare'}
              >
                <GitCompare size={15} />
                {compared ? 'Comparing' : 'Compare'}
              </button>
            </div>
            {compareErr && (
              <p style={{ fontSize: '0.75rem', color: '#fb7185' }}>{compareErr}</p>
            )}

            {/* Navigate links */}
            <div className="flex flex-col gap-2">
              <button
                className="flex items-center gap-2 py-2 px-3 rounded-xl text-left transition-all"
                style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', color: '#60a5fa', fontSize: '0.82rem', fontWeight: 500 }}
                onClick={onNavigatePriceIntel}
                id={`modal-price-intel-${product.id}`}
              >
                <BarChart2 size={14} /> View Price History
                <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
              </button>
              <button
                className="flex items-center gap-2 py-2 px-3 rounded-xl text-left transition-all"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', color: '#34d399', fontSize: '0.82rem', fontWeight: 500 }}
                onClick={onNavigateReviews}
                id={`modal-reviews-${product.id}`}
              >
                <MessageSquare size={14} /> Read Review Insights
                <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="px-6 pb-6">
          <div className="divider" style={{ margin: '0 0 20px' }} />
          <h3 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem', marginBottom: 12 }}>Specifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {product.specifications.map((spec) => (
              <div
                key={spec.label}
                className="flex items-start gap-3 py-2 px-3 rounded-xl"
                style={{ background: 'rgba(15,25,48,0.6)', border: '1px solid rgba(139,92,246,0.06)' }}
              >
                <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, minWidth: 90, flexShrink: 0 }}>
                  {spec.label}
                </span>
                <span style={{ fontSize: '0.82rem', color: '#e2e8f0' }}>{spec.value}</span>
              </div>
            ))}
          </div>

          {/* Key Features */}
          <h3 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem', margin: '20px 0 10px' }}>Key Features</h3>
          <div className="flex flex-wrap gap-2">
            {product.keyFeatures.map((feat) => (
              <span key={feat} className="badge badge-violet">{feat}</span>
            ))}
          </div>

          {/* Demo disclaimer */}
          <div
            className="flex items-start gap-2 mt-4 p-3 rounded-xl"
            style={{ background: 'rgba(6,11,24,0.6)', border: '1px solid rgba(139,92,246,0.08)' }}
          >
            <Info size={13} color="#334155" style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: '0.72rem', color: '#334155', lineHeight: 1.5 }}>
              All pricing, ratings, and specifications shown are demo data for educational and portfolio purposes only.
              They do not represent live marketplace prices or verified product information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
