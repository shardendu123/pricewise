import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Star, Info, ChevronDown, ChevronUp } from 'lucide-react';
import sampleProducts from '../data/products';
import { Product } from '../data/products';

interface ReviewInsightsPageProps {
  initialProduct?: Product | null;
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="star-rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 12 12" fill={s <= Math.round(rating) ? '#fbbf24' : 'none'}>
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

function extractThemes(reviews: Product['reviews']): { positive: string[]; negative: string[] } {
  // Simple keyword-based extraction from the included sample review text
  const positiveKeywords: Record<string, string> = {
    camera: 'Excellent camera quality',
    battery: 'Long battery life',
    display: 'Great display quality',
    performance: 'Strong performance',
    comfortable: 'Comfortable to wear/use',
    fast: 'Fast charging / processing',
    build: 'Premium build quality',
    sound: 'Good sound quality',
    value: 'Good value for money',
    lightweight: 'Lightweight and portable',
    compact: 'Compact and portable',
    quiet: 'Quiet operation',
    speed: 'Fast transfer speeds',
  };
  const negativeKeywords: Record<string, string> = {
    charger: 'No charger in the box',
    warm: 'Gets warm under load',
    price: 'Expensive price point',
    port: 'Limited port selection',
    outdoor: 'Display not ideal outdoors',
    missing: 'Missing accessories',
    stuffy: 'Ear cups can feel warm',
    slow: 'Slower than expected',
  };

  const positiveFound = new Set<string>();
  const negativeFound = new Set<string>();

  reviews.forEach((rev) => {
    const text = (rev.title + ' ' + rev.body).toLowerCase();
    if (rev.rating >= 4) {
      Object.entries(positiveKeywords).forEach(([kw, theme]) => {
        if (text.includes(kw)) positiveFound.add(theme);
      });
    }
    if (rev.rating <= 3) {
      Object.entries(negativeKeywords).forEach(([kw, theme]) => {
        if (text.includes(kw)) negativeFound.add(theme);
      });
    }
    // Catch negative cues even in 4-star reviews
    Object.entries(negativeKeywords).forEach(([kw, theme]) => {
      if (text.includes(kw) && rev.rating < 5) negativeFound.add(theme);
    });
  });

  return {
    positive: Array.from(positiveFound).slice(0, 5),
    negative: Array.from(negativeFound).slice(0, 4),
  };
}

export default function ReviewInsightsPage({ initialProduct }: ReviewInsightsPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    initialProduct || sampleProducts[0]
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  const reviews = selectedProduct.reviews;
  const themes = extractThemes(reviews);

  const positiveCount = reviews.filter((r) => r.rating >= 4).length;
  const negativeCount = reviews.filter((r) => r.rating < 4).length;
  const positivePct = Math.round((positiveCount / reviews.length) * 100);
  const negativePct = 100 - positivePct;

  const ratingDist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const key = Math.min(5, Math.max(1, Math.round(r.rating)));
    ratingDist[key]++;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="section-title">Review Insights</h1>
        <p className="section-subtitle">
          Themes extracted from included sample reviews · Not verified customer data · Demo only
        </p>
      </div>

      {/* Product Selector */}
      <div className="glass-card p-5 mb-6">
        <label className="block mb-3" style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
          Select Product
        </label>
        <div className="flex flex-wrap gap-2">
          {sampleProducts.map((p) => (
            <button
              key={p.id}
              className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
              style={{
                background: selectedProduct.id === p.id ? 'rgba(139,92,246,0.2)' : 'rgba(15,25,48,0.6)',
                border: `1px solid ${selectedProduct.id === p.id ? 'rgba(139,92,246,0.5)' : 'rgba(139,92,246,0.12)'}`,
                color: selectedProduct.id === p.id ? '#c4b5fd' : '#64748b',
                fontSize: '0.8rem',
                fontWeight: selectedProduct.id === p.id ? 600 : 400,
              }}
              onClick={() => setSelectedProduct(p)}
            >
              <img src={p.imageUrl} alt={p.name} className="w-7 h-7 rounded-lg object-cover" />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Sentiment summary */}
        <div className="flex flex-col gap-4">
          {/* Overall */}
          <div className="glass-card p-5">
            <h2 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem', marginBottom: 14 }}>
              Overall Sample Rating
            </h2>
            <div className="flex items-center gap-4 mb-5">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>
                  {selectedProduct.rating}
                </div>
                <StarRating rating={selectedProduct.rating} size={16} />
                <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: 4 }}>
                  {selectedProduct.reviewCount.toLocaleString()} demo reviews
                </div>
              </div>
              <div className="flex-1">
                {([5, 4, 3, 2, 1] as const).map((star) => {
                  const count = ratingDist[star] || 0;
                  const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 mb-1.5">
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', width: 18 }}>{star}★</span>
                      <div
                        className="flex-1 rounded-full overflow-hidden"
                        style={{ height: 6, background: 'rgba(139,92,246,0.1)' }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: star >= 4 ? '#10b981' : star === 3 ? '#f59e0b' : '#f43f5e', transition: 'width 0.5s ease' }}
                        />
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#475569', width: 18, textAlign: 'right' }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sentiment percentages */}
            <div
              className="rounded-xl p-3"
              style={{ background: 'rgba(6,11,24,0.6)', border: '1px solid rgba(139,92,246,0.1)' }}
            >
              <p style={{ fontSize: '0.7rem', color: '#475569', marginBottom: 8 }}>
                Based on {reviews.length} included sample reviews:
              </p>
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5">
                  <ThumbsUp size={13} color="#10b981" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>{positivePct}%</span>
                  <span style={{ fontSize: '0.75rem', color: '#475569' }}>Positive</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ThumbsDown size={13} color="#f43f5e" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f43f5e' }}>{negativePct}%</span>
                  <span style={{ fontSize: '0.75rem', color: '#475569' }}>Negative</span>
                </div>
              </div>
            </div>
          </div>

          {/* Themes */}
          <div className="glass-card p-5">
            <h2 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem', marginBottom: 14 }}>
              Common Themes
            </h2>
            {themes.positive.length > 0 && (
              <div className="mb-4">
                <p style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600, marginBottom: 8 }}>
                  <ThumbsUp size={12} style={{ display: 'inline', marginRight: 4 }} />
                  Mentioned positively
                </p>
                {themes.positive.map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-2 py-1.5 px-3 mb-1.5 rounded-lg"
                    style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', fontSize: '0.8rem', color: '#d1fae5' }}
                  >
                    ✓ {t}
                  </div>
                ))}
              </div>
            )}
            {themes.negative.length > 0 && (
              <div>
                <p style={{ fontSize: '0.75rem', color: '#fb7185', fontWeight: 600, marginBottom: 8 }}>
                  <ThumbsDown size={12} style={{ display: 'inline', marginRight: 4 }} />
                  Mentioned as concerns
                </p>
                {themes.negative.map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-2 py-1.5 px-3 mb-1.5 rounded-lg"
                    style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)', fontSize: '0.8rem', color: '#fecdd3' }}
                  >
                    ✗ {t}
                  </div>
                ))}
              </div>
            )}
            {themes.positive.length === 0 && themes.negative.length === 0 && (
              <p style={{ color: '#475569', fontSize: '0.825rem' }}>
                Not enough review text to extract themes for this product.
              </p>
            )}
            <div
              className="flex items-start gap-2 mt-4 p-3 rounded-xl"
              style={{ background: 'rgba(6,11,24,0.6)', border: '1px solid rgba(139,92,246,0.1)' }}
            >
              <Info size={13} color="#475569" style={{ marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontSize: '0.72rem', color: '#475569', lineHeight: 1.5 }}>
                Themes are extracted by keyword matching from the {reviews.length} sample reviews included in this demo dataset.
                They do not represent a verified or comprehensive customer sentiment analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Right — Review list */}
        <div className="lg:col-span-2">
          <div className="glass-card p-5">
            <h2 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem', marginBottom: 2 }}>
              Sample Reviews
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: 16 }}>
              Demo data — these are not verified real customer reviews
            </p>

            {reviews.map((review) => (
              <div
                key={review.id}
                className="py-4"
                style={{ borderBottom: '1px solid rgba(139,92,246,0.08)' }}
              >
                <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: 36,
                        height: 36,
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.3))',
                        border: '1px solid rgba(139,92,246,0.3)',
                        fontWeight: 700,
                        color: '#a78bfa',
                        fontSize: '0.85rem',
                      }}
                    >
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.875rem' }}>
                        {review.author}
                        {review.verified && (
                          <span className="ml-2 badge badge-emerald" style={{ fontSize: '0.6rem' }}>✓ Demo verified</span>
                        )}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: '#475569' }}>{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <StarRating rating={review.rating} />
                    <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600 }}>{review.rating}</span>
                  </div>
                </div>

                <p style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.875rem', marginBottom: 4 }}>{review.title}</p>

                <p
                  style={{
                    fontSize: '0.825rem',
                    color: '#64748b',
                    lineHeight: 1.6,
                    display: expanded === review.id ? 'block' : '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: expanded === review.id ? 'visible' : 'hidden',
                  }}
                >
                  {review.body}
                </p>

                <div className="flex items-center gap-4 mt-2">
                  <button
                    style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    onClick={() => setExpanded(expanded === review.id ? null : review.id)}
                  >
                    {expanded === review.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {expanded === review.id ? 'Show less' : 'Read more'}
                  </button>
                  <span style={{ fontSize: '0.72rem', color: '#334155' }}>
                    👍 {review.helpful} found helpful (demo)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
