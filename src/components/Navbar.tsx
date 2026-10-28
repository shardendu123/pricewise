import React, { useState } from 'react';
import { Menu, X, BarChart2, Heart, GitCompare, Home, Compass, DollarSign, Zap } from 'lucide-react';

type Page =
  | 'home'
  | 'explore'
  | 'compare'
  | 'price-intelligence'
  | 'reviews'
  | 'budget'
  | 'wishlist';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  wishlistCount: number;
  compareCount: number;
}

const NAV_ITEMS: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'home', label: 'Home', icon: <Home size={15} /> },
  { page: 'explore', label: 'Explore', icon: <Compass size={15} /> },
  { page: 'compare', label: 'Compare', icon: <GitCompare size={15} /> },
  { page: 'price-intelligence', label: 'Insights', icon: <BarChart2 size={15} /> },
  { page: 'budget', label: 'Budget', icon: <DollarSign size={15} /> },
];

export default function Navbar({ currentPage, onNavigate, wishlistCount, compareCount }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'rgba(6,11,24,0.85)',
        borderBottom: '1px solid rgba(139,92,246,0.12)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between" style={{ height: '64px' }}>
        {/* Logo */}
        <button
          className="flex items-center gap-2 cursor-pointer"
          style={{ background: 'none', border: 'none' }}
          onClick={() => onNavigate('home')}
          aria-label="Go to homepage"
        >
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            }}
          >
            <Zap size={18} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f1f5f9', letterSpacing: '-0.3px' }}>
            Price<span className="gradient-text">Wise</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ page, label, icon }) => (
            <button
              key={page}
              className={`nav-link flex items-center gap-1.5 ${currentPage === page ? 'active' : ''}`}
              onClick={() => onNavigate(page)}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Wishlist */}
          <button
            className="btn-ghost relative"
            onClick={() => onNavigate('wishlist')}
            aria-label={`Wishlist (${wishlistCount} items)`}
            title="Wishlist"
          >
            <Heart size={17} />
            {wishlistCount > 0 && (
              <span
                className="absolute"
                style={{
                  top: -4,
                  right: -4,
                  background: '#f43f5e',
                  color: 'white',
                  borderRadius: '50%',
                  width: 17,
                  height: 17,
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Compare */}
          <button
            className="btn-ghost relative"
            onClick={() => onNavigate('compare')}
            aria-label={`Compare (${compareCount} products)`}
            title="Compare products"
          >
            <GitCompare size={17} />
            {compareCount > 0 && (
              <span
                className="absolute"
                style={{
                  top: -4,
                  right: -4,
                  background: '#8b5cf6',
                  color: 'white',
                  borderRadius: '50%',
                  width: 17,
                  height: 17,
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {compareCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="btn-ghost md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            background: 'rgba(6,11,24,0.97)',
            borderTop: '1px solid rgba(139,92,246,0.12)',
            padding: '12px 16px',
          }}
        >
          {NAV_ITEMS.map(({ page, label, icon }) => (
            <button
              key={page}
              className={`nav-link w-full flex items-center gap-2 py-3 ${currentPage === page ? 'active' : ''}`}
              style={{ fontSize: '0.95rem' }}
              onClick={() => {
                onNavigate(page);
                setMenuOpen(false);
              }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
