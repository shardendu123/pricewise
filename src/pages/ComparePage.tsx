import React, { useState, useEffect } from 'react';
import { X, Trophy, TrendingDown, Star, ShieldCheck, Info } from 'lucide-react';
import sampleProducts from '../data/products';
import { Product, Specification } from '../data/products';
import { getCompareList, removeFromCompare, clearCompare } from '../utils/storage';

interface ComparePageProps {
  onNavigateExplore: () => void;
}

const VALUE_SCORE_CRITERIA = [
  'Discount % from original price (30%)',
  'Normalised rating out of 5 stars (40%)',
  'Price vs category average (30%)',
];

function SpecRow({ label, values }: { label: string; values: (string | undefined)[] }) {
  const allSame = values.every((v) => v === values[0]);
  return (
    <tr style={{ borderBottom: '1px solid rgba(139,92,246,0.08)' }}>
      <td
        className="sticky left-0"
        style={{
          padding: '10px 16px',
          fontWeight: 500,
          fontSize: '0.82rem',
          color: '#94a3b8',
          background: '#0a1020',
          minWidth: 140,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          style={{
            padding: '10px 16px',
            fontSize: '0.82rem',
            color: '#f1f5f9',
            minWidth: 180,
            textAlign: 'center',
            background: !allSame && v === values.reduce((best, cur) => cur && (!best || cur.length > best.length) ? cur : best, undefined) ? 'rgba(139,92,246,0.06)' : 'transparent',
          }}
        >
          {v || <span style={{ color: '#334155' }}>—</span>}
        </td>
      ))}
    </tr>
  );
}

export default function ComparePage({ onNavigateExplore }: ComparePageProps) {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCriteria, setShowCriteria] = useState(false);

  useEffect(() => {
    const load = () => setCompareIds(getCompareList());
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  const products = compareIds
    .map((id) => sampleProducts.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  function handleRemove(id: string) {
    removeFromCompare(id);
    setCompareIds((prev) => prev.filter((x) => x !== id));
  }

  function handleClear() {
    clearCompare();
    setCompareIds([]);
  }

  // Get union of all spec labels
  const allSpecLabels = Array.from(
    new Set(products.flatMap((p) => p.specifications.map((s) => s.label)))
  );

  const lowestPrice = products.length
    ? Math.min(...products.map((p) => p.currentPrice))
    : null;

  const highestRating = products.length
    ? Math.max(...products.map((p) => p.rating))
    : null;

  const highestValue = products.length
    ? Math.max(...products.map((p) => p.valueScore))
    : null;

  if (compareIds.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="glass-card p-16">
          <p style={{ fontSize: '4rem', marginBottom: 20 }}>⚖️</p>
          <h1 className="section-title mb-3">Product Comparison</h1>
          <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: 28, maxWidth: 460, margin: '0 auto 28px' }}>
            You haven't added any products to compare yet. Browse the product explorer and click the{' '}
            <strong style={{ color: '#a78bfa' }}>compare icon</strong> on any product card.
          </p>
          <button className="btn-primary" onClick={onNavigateExplore} id="go-explore-from-compare">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  if (compareIds.length === 1) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="glass-card p-16">
          <p style={{ fontSize: '3rem', marginBottom: 16 }}>➕</p>
          <h1 className="section-title mb-3">Add One More Product</h1>
          <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: 28 }}>
            You need at least 2 products to compare. Add another from the explorer.
          </p>
          <button className="btn-primary" onClick={onNavigateExplore}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="section-title">Product Comparison</h1>
          <p className="section-subtitle">
            Comparing {products.length} products · All prices are simulated demo data
          </p>
        </div>
        <button className="btn-ghost text-sm" onClick={handleClear} id="clear-compare-btn">
          <X size={14} /> Clear all
        </button>
      </div>

      {/* Add more hint */}
      {products.length < 4 && (
        <div
          className="flex items-center gap-3 mb-6 p-3 rounded-xl"
          style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
        >
          <Info size={16} color="#60a5fa" />
          <span style={{ fontSize: '0.825rem', color: '#60a5fa' }}>
            You can add up to {4 - products.length} more product{products.length < 3 ? 's' : ''} — browse the explorer and click the compare icon.
          </span>
          <button className="btn-secondary text-xs ml-auto" onClick={onNavigateExplore} style={{ padding: '6px 14px' }}>
            Add products
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div
        className="overflow-x-auto mb-6 rounded-2xl"
        style={{ border: '1px solid rgba(139,92,246,0.15)' }}
      >
        <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: products.length * 200 + 140 }}>
          {/* Product headers */}
          <thead>
            <tr style={{ background: 'rgba(10,16,32,0.9)' }}>
              <th
                className="sticky left-0"
                style={{
                  width: 140,
                  background: '#060b18',
                  borderRight: '1px solid rgba(139,92,246,0.1)',
                }}
              />
              {products.map((p) => (
                <th key={p.id} style={{ padding: '16px', textAlign: 'center', position: 'relative' }}>
                  <button
                    className="absolute top-2 right-2 p-1 rounded-lg"
                    style={{ background: 'rgba(244,63,94,0.15)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.2)' }}
                    onClick={() => handleRemove(p.id)}
                    aria-label={`Remove ${p.name} from comparison`}
                  >
                    <X size={12} />
                  </button>
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-20 h-20 object-cover rounded-xl mx-auto mb-2"
                  />
                  <p style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.875rem', lineHeight: 1.3 }}>{p.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: 2 }}>{p.brand}</p>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Price */}
            <tr style={{ background: 'rgba(6,11,24,0.8)', borderBottom: '1px solid rgba(139,92,246,0.08)' }}>
              <td
                className="sticky left-0"
                style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.8rem', color: '#94a3b8', background: '#0a1020', whiteSpace: 'nowrap' }}
              >
                Demo Price
              </td>
              {products.map((p) => (
                <td key={p.id} style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: p.currentPrice === lowestPrice ? '#34d399' : '#f1f5f9',
                    }}
                  >
                    {p.currency}{p.currentPrice.toLocaleString()}
                    {p.currentPrice === lowestPrice && (
                      <span className="ml-1 badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                        <Trophy size={9} /> Lowest
                      </span>
                    )}
                  </div>
                  {p.originalPrice && (
                    <div className="price-original">
                      {p.currency}{p.originalPrice.toLocaleString()}
                      {' '}
                      <span style={{ color: '#f43f5e', fontSize: '0.7rem' }}>
                        ({Math.round(((p.originalPrice - p.currentPrice) / p.originalPrice) * 100)}% off)
                      </span>
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr style={{ background: 'rgba(6,11,24,0.4)', borderBottom: '1px solid rgba(139,92,246,0.08)' }}>
              <td
                className="sticky left-0"
                style={{ padding: '10px 16px', fontWeight: 600, fontSize: '0.8rem', color: '#94a3b8', background: '#0a1020', whiteSpace: 'nowrap' }}
              >
                Demo Rating
              </td>
              {products.map((p) => (
                <td key={p.id} style={{ padding: '10px 16px', textAlign: 'center' }}>
                  <div className="flex items-center justify-center gap-1">
                    <Star size={14} color="#fbbf24" fill="#fbbf24" />
                    <span
                      style={{
                        fontWeight: 700,
                        color: p.rating === highestRating ? '#fbbf24' : '#f1f5f9',
                        fontSize: '0.95rem',
                      }}
                    >
                      {p.rating}
                    </span>
                    {p.rating === highestRating && (
                      <span className="badge badge-amber" style={{ fontSize: '0.6rem' }}>Best</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#475569' }}>({p.reviewCount.toLocaleString()} demo reviews)</div>
                </td>
              ))}
            </tr>

            {/* Value Score */}
            <tr style={{ background: 'rgba(6,11,24,0.8)', borderBottom: '2px solid rgba(139,92,246,0.15)' }}>
              <td
                className="sticky left-0"
                style={{ padding: '10px 16px', fontWeight: 600, fontSize: '0.8rem', color: '#94a3b8', background: '#0a1020', whiteSpace: 'nowrap' }}
              >
                <div className="flex items-center gap-1">
                  Value Score
                  <button
                    style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 0 }}
                    onClick={() => setShowCriteria((v) => !v)}
                    aria-label="Show value score criteria"
                  >
                    <Info size={12} />
                  </button>
                </div>
              </td>
              {products.map((p) => (
                <td key={p.id} style={{ padding: '10px 16px', textAlign: 'center' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      border: `2px solid ${p.valueScore === highestValue ? '#8b5cf6' : 'rgba(139,92,246,0.3)'}`,
                      background: p.valueScore === highestValue ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.06)',
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: p.valueScore === highestValue ? '#c4b5fd' : '#f1f5f9',
                    }}
                  >
                    {p.valueScore}
                  </div>
                  {p.valueScore === highestValue && (
                    <div className="mt-1">
                      <span className="badge badge-violet" style={{ fontSize: '0.6rem' }}>
                        <TrendingDown size={9} /> Best value
                      </span>
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {showCriteria && (
              <tr>
                <td colSpan={products.length + 1} style={{ padding: '8px 16px 12px' }}>
                  <div
                    className="rounded-xl p-3"
                    style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}
                  >
                    <p style={{ fontSize: '0.78rem', color: '#a78bfa', fontWeight: 600, marginBottom: 4 }}>
                      Value Score Criteria (0–100)
                    </p>
                    <ul style={{ listStyle: 'disc', paddingLeft: 20 }}>
                      {VALUE_SCORE_CRITERIA.map((c) => (
                        <li key={c} style={{ fontSize: '0.75rem', color: '#64748b' }}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </td>
              </tr>
            )}

            {/* Warranty */}
            <SpecRow label="Warranty" values={products.map((p) => p.warranty)} />

            {/* Dynamic specs */}
            {allSpecLabels.map((label) => (
              <SpecRow
                key={label}
                label={label}
                values={products.map((p) => {
                  const spec = p.specifications.find((s) => s.label === label);
                  return spec?.value;
                })}
              />
            ))}

            {/* Key Features */}
            <tr style={{ background: 'rgba(6,11,24,0.4)' }}>
              <td
                className="sticky left-0"
                style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.8rem', color: '#94a3b8', background: '#0a1020', whiteSpace: 'nowrap', verticalAlign: 'top' }}
              >
                Key Features
              </td>
              {products.map((p) => (
                <td key={p.id} style={{ padding: '12px 16px', textAlign: 'center', verticalAlign: 'top' }}>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {p.keyFeatures.map((feat) => (
                      <span key={feat} className="tag-pill" style={{ fontSize: '0.7rem' }}>
                        {feat}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Warranty note */}
      <p style={{ fontSize: '0.75rem', color: '#334155', textAlign: 'center', marginTop: 8 }}>
        <ShieldCheck size={12} style={{ display: 'inline', marginRight: 4 }} />
        All specifications and warranty information shown here are from our demo dataset and do not reflect live product listings.
      </p>
    </div>
  );
}
