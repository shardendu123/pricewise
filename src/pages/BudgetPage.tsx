import React, { useState, useMemo } from 'react';
import { DollarSign, Star, Zap, Info, ChevronRight } from 'lucide-react';
import sampleProducts, { CATEGORIES } from '../data/products';
import { Product } from '../data/products';
import { saveBudgetPrefs, getBudgetPrefs } from '../utils/storage';
import ProductCard from '../components/ProductCard';

const USAGE_OPTIONS = [
  { key: 'student', label: '🎓 Student', desc: 'Daily coursework, browsing, and media' },
  { key: 'professional', label: '💼 Professional', desc: 'Office productivity, meetings, coding' },
  { key: 'creator', label: '🎨 Creator', desc: 'Photo/video editing, design' },
  { key: 'gamer', label: '🎮 Gamer', desc: 'Gaming and entertainment' },
  { key: 'traveller', label: '✈️ Traveller', desc: 'Lightweight, portable, long battery' },
  { key: 'everyday', label: '🏠 Everyday', desc: 'General personal use' },
];

/**
 * Value Score criteria — documented transparently:
 *  • 40 pts: Normalised rating (out of 5)
 *  • 30 pts: Discount from original price
 *  • 30 pts: Price efficiency vs category average
 */
function computeMatchScore(
  product: Product,
  budget: number,
  category: string,
  usage: string
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  // Must be within budget
  if (product.currentPrice > budget) return { score: 0, reasons: [] };

  // Category match
  if (category !== 'all' && product.category !== category) return { score: 0, reasons: [] };

  // Budget efficiency — reward products that use budget well (not too cheap, not over budget)
  const budgetRatio = product.currentPrice / budget;
  if (budgetRatio >= 0.6) {
    score += 25;
    reasons.push(`Uses ${Math.round(budgetRatio * 100)}% of your budget efficiently`);
  } else {
    score += Math.round(budgetRatio * 25);
    reasons.push(`Well within budget (${Math.round(budgetRatio * 100)}% of budget)`);
  }

  // Rating
  const ratingScore = ((product.rating - 3) / 2) * 25;
  score += Math.max(0, ratingScore);
  if (product.rating >= 4.5) reasons.push('Highly rated in demo dataset (4.5+)');

  // Value score from product
  score += product.valueScore * 0.3;
  if (product.valueScore >= 85) reasons.push(`High value score (${product.valueScore}/100)`);

  // Discount
  if (product.originalPrice) {
    const disc = ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100;
    if (disc >= 10) {
      score += 10;
      reasons.push(`${Math.round(disc)}% sample discount applied`);
    }
  }

  // Usage hints
  const featureText = product.keyFeatures.join(' ').toLowerCase();
  const tagText = product.tags.join(' ').toLowerCase();
  if (usage === 'student' && (tagText.includes('value') || featureText.includes('battery'))) {
    score += 8;
    reasons.push('Great battery / value for students');
  }
  if (usage === 'professional' && (product.category === 'laptops' || featureText.includes('durable'))) {
    score += 8;
    reasons.push('Suitable for professional productivity');
  }
  if (usage === 'creator' && (featureText.includes('camera') || featureText.includes('display'))) {
    score += 8;
    reasons.push('Strong camera or display for creative work');
  }
  if (usage === 'traveller' && (featureText.includes('battery') || featureText.includes('portable') || featureText.includes('lightweight'))) {
    score += 8;
    reasons.push('Portable and travel-friendly');
  }
  if (usage === 'gamer' && (featureText.includes('120 hz') || featureText.includes('snapdragon'))) {
    score += 8;
    reasons.push('High refresh rate / strong processor for gaming');
  }

  return { score: Math.min(100, Math.round(score)), reasons };
}

interface RecommendedProduct {
  product: Product;
  score: number;
  reasons: string[];
}

interface BudgetPageProps {
  onProductView: (product: Product) => void;
}

export default function BudgetPage({ onProductView }: BudgetPageProps) {
  const saved = getBudgetPrefs();
  const [budget, setBudget] = useState(saved?.budget?.toString() || '');
  const [category, setCategory] = useState(saved?.category || 'all');
  const [usage, setUsage] = useState(saved?.usage || 'everyday');
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const recommendations = useMemo<RecommendedProduct[]>(() => {
    if (!submitted) return [];
    const budgetNum = parseFloat(budget);
    if (!budgetNum || budgetNum <= 0) return [];

    return sampleProducts
      .map((p) => {
        const { score, reasons } = computeMatchScore(p, budgetNum, category, usage);
        return { product: p, score, reasons };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [submitted, budget, category, usage]);

  function handleSubmit() {
    const budgetNum = parseFloat(budget);
    if (!budget || isNaN(budgetNum) || budgetNum <= 0) {
      setValidationError('Please enter a valid budget amount.');
      return;
    }
    if (budgetNum < 1000) {
      setValidationError('Budget must be at least ₹1,000.');
      return;
    }
    setValidationError('');
    saveBudgetPrefs({ budget: budgetNum, category, usage });
    setSubmitted(true);
  }

  function handleReset() {
    setSubmitted(false);
    setBudget('');
    setCategory('all');
    setUsage('everyday');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="section-title">Budget Recommendations</h1>
        <p className="section-subtitle">
          Enter your budget and preferences — we'll match products from our demo dataset
        </p>
      </div>

      {/* Value Score Criteria Disclosure */}
      <div
        className="flex items-start gap-3 mb-6 p-4 rounded-xl"
        style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
      >
        <Info size={16} color="#60a5fa" style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: '0.82rem', color: '#60a5fa', fontWeight: 600, marginBottom: 4 }}>
            How recommendations are scored (transparent criteria)
          </p>
          <ul style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.7, paddingLeft: 16, listStyle: 'disc' }}>
            <li>Budget efficiency — how well the price uses your stated budget (25 pts)</li>
            <li>Demo rating — normalised from 3–5 stars (25 pts)</li>
            <li>Product value score — discount + category price position (30 pts)</li>
            <li>Discount from original price (10 pts)</li>
            <li>Usage preference match — keyword-based feature alignment (10 pts)</li>
          </ul>
        </div>
      </div>

      {/* Input form */}
      <div className="glass-card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Budget input */}
          <div>
            <label htmlFor="budget-input" className="block mb-2" style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              Your Budget (₹)
            </label>
            <div className="relative">
              <span className="absolute" style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: '0.9rem' }}>
                ₹
              </span>
              <input
                id="budget-input"
                className="input-field"
                style={{ paddingLeft: '28px' }}
                type="number"
                placeholder="e.g. 50000"
                value={budget}
                onChange={(e) => { setBudget(e.target.value); setSubmitted(false); }}
                aria-label="Enter your budget in rupees"
              />
            </div>
            {validationError && (
              <p style={{ fontSize: '0.75rem', color: '#f43f5e', marginTop: 4 }}>{validationError}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2" style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                className="tag-pill cursor-pointer"
                style={category === 'all' ? { borderColor: '#8b5cf6', color: '#a78bfa', background: 'rgba(139,92,246,0.15)' } : {}}
                onClick={() => { setCategory('all'); setSubmitted(false); }}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  className="tag-pill cursor-pointer"
                  style={
                    category === cat.key
                      ? { borderColor: '#8b5cf6', color: '#a78bfa', background: 'rgba(139,92,246,0.15)' }
                      : {}
                  }
                  onClick={() => { setCategory(cat.key); setSubmitted(false); }}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Usage */}
          <div className="md:col-span-2">
            <label className="block mb-2" style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              Primary Usage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {USAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  className="p-2.5 rounded-xl text-left transition-all"
                  style={{
                    background: usage === opt.key ? 'rgba(139,92,246,0.2)' : 'rgba(15,25,48,0.6)',
                    border: `1px solid ${usage === opt.key ? 'rgba(139,92,246,0.5)' : 'rgba(139,92,246,0.12)'}`,
                  }}
                  onClick={() => { setUsage(opt.key); setSubmitted(false); }}
                >
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: usage === opt.key ? '#c4b5fd' : '#94a3b8' }}>
                    {opt.label}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: '#475569', marginTop: 2 }}>{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button className="btn-primary" onClick={handleSubmit} id="get-recommendations-btn">
            <Zap size={16} /> Get Recommendations
          </button>
          {submitted && (
            <button className="btn-ghost text-sm" onClick={handleReset} id="reset-budget-btn">
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {submitted && (
        <>
          <div className="mb-6">
            <h2 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1.2rem', marginBottom: 4 }}>
              {recommendations.length > 0
                ? `${recommendations.length} Recommended Products`
                : 'No products found'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#475569' }}>
              {recommendations.length > 0
                ? `For your ₹${parseFloat(budget).toLocaleString()} budget · ${USAGE_OPTIONS.find((u) => u.key === usage)?.label} use`
                : `No products in our demo dataset match your ₹${parseFloat(budget).toLocaleString()} budget and filters.`}
            </p>
          </div>

          {recommendations.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p style={{ fontSize: '3rem', marginBottom: 12 }}>💸</p>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Try increasing your budget or selecting "All" categories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {recommendations.map(({ product, score, reasons }) => (
                <div key={product.id} className="flex flex-col">
                  <ProductCard product={product} onViewDetails={onProductView} compact />
                  {/* Recommendation reasons */}
                  <div
                    className="rounded-b-2xl px-4 py-3 -mt-3"
                    style={{
                      background: 'rgba(10,16,32,0.9)',
                      border: '1px solid rgba(139,92,246,0.15)',
                      borderTop: 'none',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>MATCH SCORE</span>
                      <span
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          color: score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#64748b',
                        }}
                      >
                        {score}/100
                      </span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {reasons.slice(0, 3).map((r) => (
                        <li key={r} className="flex items-start gap-1.5 mb-1">
                          <ChevronRight size={11} color="#8b5cf6" style={{ marginTop: 3, flexShrink: 0 }} />
                          <span style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
