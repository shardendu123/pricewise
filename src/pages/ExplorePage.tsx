import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown, ChevronDown } from 'lucide-react';
import sampleProducts, { CATEGORIES } from '../data/products';
import { Product } from '../data/products';
import ProductCard from '../components/ProductCard';

interface ExplorePageProps {
  onProductView: (product: Product) => void;
}

type SortKey = 'price-asc' | 'price-desc' | 'rating-desc' | 'value-desc';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'rating-desc', label: 'Highest Rated' },
  { key: 'value-desc', label: 'Best Value Score' },
];

export default function ExplorePage({ onProductView }: ExplorePageProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minRating, setMinRating] = useState(0);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('rating-desc');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let results = [...sampleProducts];

    // Search
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory !== 'all') {
      results = results.filter((p) => p.category === selectedCategory);
    }

    // Rating
    if (minRating > 0) {
      results = results.filter((p) => p.rating >= minRating);
    }

    // Price range
    const min = parseFloat(priceMin) || 0;
    const max = parseFloat(priceMax) || Infinity;
    results = results.filter((p) => p.currentPrice >= min && p.currentPrice <= max);

    // Sort
    switch (sortKey) {
      case 'price-asc':
        results.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case 'price-desc':
        results.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'rating-desc':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'value-desc':
        results.sort((a, b) => b.valueScore - a.valueScore);
        break;
    }

    return results;
  }, [query, selectedCategory, minRating, priceMin, priceMax, sortKey]);

  function clearFilters() {
    setQuery('');
    setSelectedCategory('all');
    setMinRating(0);
    setPriceMin('');
    setPriceMax('');
    setSortKey('rating-desc');
  }

  const hasFilters =
    query || selectedCategory !== 'all' || minRating > 0 || priceMin || priceMax;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">Explore Products</h1>
        <p className="section-subtitle">
          Browse {sampleProducts.length} demo products · All prices and ratings are simulated
        </p>
      </div>

      {/* Search + Controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute"
            style={{ left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }}
          />
          <input
            id="explore-search"
            className="input-field"
            style={{ paddingLeft: '40px' }}
            placeholder="Search by name, brand, or tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
          {query && (
            <button
              className="absolute"
              style={{ right: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }}
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            className="btn-secondary flex items-center gap-2 whitespace-nowrap"
            onClick={() => setSortOpen((o) => !o)}
            aria-label="Sort options"
            id="sort-dropdown-btn"
          >
            <ArrowUpDown size={15} />
            {SORT_OPTIONS.find((o) => o.key === sortKey)?.label}
            <ChevronDown size={14} />
          </button>
          {sortOpen && (
            <div
              className="absolute right-0 mt-2 rounded-xl overflow-hidden z-40"
              style={{
                background: 'rgba(10,16,32,0.97)',
                border: '1px solid rgba(139,92,246,0.2)',
                minWidth: 200,
                top: '100%',
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                  style={{
                    color: sortKey === opt.key ? '#a78bfa' : '#94a3b8',
                    background: sortKey === opt.key ? 'rgba(139,92,246,0.1)' : 'transparent',
                    fontWeight: sortKey === opt.key ? 600 : 400,
                    borderBottom: '1px solid rgba(139,92,246,0.06)',
                  }}
                  onMouseEnter={(e) => { if (sortKey !== opt.key) e.currentTarget.style.background = 'rgba(139,92,246,0.05)'; }}
                  onMouseLeave={(e) => { if (sortKey !== opt.key) e.currentTarget.style.background = 'transparent'; }}
                  onClick={() => {
                    setSortKey(opt.key);
                    setSortOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filters toggle */}
        <button
          className={`btn-${showFilters ? 'primary' : 'secondary'} flex items-center gap-2 whitespace-nowrap`}
          onClick={() => setShowFilters((v) => !v)}
          id="toggle-filters-btn"
          aria-expanded={showFilters}
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasFilters && (
            <span
              className="rounded-full px-1.5"
              style={{ background: '#f43f5e', color: 'white', fontSize: '0.65rem', fontWeight: 700 }}
            >
              !
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="glass-card p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Category */}
          <div>
            <label className="block mb-2" style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`tag-pill cursor-pointer transition-all ${selectedCategory === 'all' ? 'active' : ''}`}
                style={selectedCategory === 'all' ? { borderColor: '#8b5cf6', color: '#a78bfa', background: 'rgba(139,92,246,0.15)' } : {}}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  className="tag-pill cursor-pointer transition-all"
                  style={
                    selectedCategory === cat.key
                      ? { borderColor: '#8b5cf6', color: '#a78bfa', background: 'rgba(139,92,246,0.15)' }
                      : {}
                  }
                  onClick={() => setSelectedCategory(cat.key)}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Min Rating */}
          <div>
            <label htmlFor="min-rating" className="block mb-2" style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              Min Rating: {minRating > 0 ? `${minRating}★` : 'Any'}
            </label>
            <div className="flex gap-2">
              {[0, 3, 3.5, 4, 4.5].map((r) => (
                <button
                  key={r}
                  className="tag-pill cursor-pointer"
                  style={
                    minRating === r
                      ? { borderColor: '#fbbf24', color: '#fbbf24', background: 'rgba(251,191,36,0.12)' }
                      : {}
                  }
                  onClick={() => setMinRating(r)}
                >
                  {r === 0 ? 'Any' : `${r}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block mb-2" style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              Price Range (₹, demo)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="price-min"
                className="input-field"
                style={{ width: '90px', padding: '8px 10px', fontSize: '0.8rem' }}
                placeholder="Min"
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                aria-label="Minimum price"
              />
              <span style={{ color: '#475569' }}>–</span>
              <input
                id="price-max"
                className="input-field"
                style={{ width: '90px', padding: '8px 10px', fontSize: '0.8rem' }}
                placeholder="Max"
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                aria-label="Maximum price"
              />
            </div>
          </div>

          {/* Clear */}
          <div className="flex items-end">
            {hasFilters && (
              <button className="btn-ghost text-sm" onClick={clearFilters} id="clear-filters-btn">
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Result count */}
      <div className="flex items-center justify-between mb-5">
        <p style={{ fontSize: '0.875rem', color: '#475569' }}>
          Showing <strong style={{ color: '#f1f5f9' }}>{filtered.length}</strong> of {sampleProducts.length} products
        </p>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <p style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</p>
          <h3 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1.1rem', marginBottom: 8 }}>No products found</h3>
          <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: 20 }}>
            Try adjusting your search or removing some filters.
          </p>
          <button className="btn-secondary" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onViewDetails={onProductView} />
          ))}
        </div>
      )}
    </div>
  );
}
