import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Bell, BellOff, TrendingDown, TrendingUp, Minus, Info, X, CheckCircle } from 'lucide-react';
import sampleProducts from '../data/products';
import { Product } from '../data/products';
import { addAlert, getAlerts, removeAlert, PriceAlert } from '../utils/storage';

interface PriceIntelligencePageProps {
  initialProduct?: Product | null;
}

// Custom tooltip for the chart
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: 'rgba(10,16,32,0.97)',
        border: '1px solid rgba(139,92,246,0.3)',
        fontSize: '0.8rem',
      }}
    >
      <p style={{ color: '#64748b', marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#a78bfa', fontWeight: 700 }}>₹{payload[0].value.toLocaleString()} (demo)</p>
    </div>
  );
}

export default function PriceIntelligencePage({ initialProduct }: PriceIntelligencePageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    initialProduct || sampleProducts[0]
  );
  const [alertTarget, setAlertTarget] = useState('');
  const [alertSaved, setAlertSaved] = useState(false);
  const [alerts, setAlerts] = useState<PriceAlert[]>(getAlerts);

  const history = selectedProduct.priceHistory;
  const prices = history.map((h) => h.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const currentPrice = selectedProduct.currentPrice;
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

  // Determine relative position
  const range = maxPrice - minPrice;
  const relPos = range === 0 ? 50 : ((currentPrice - minPrice) / range) * 100;
  let priceAssessment: { label: string; color: string; icon: React.ReactNode } = {
    label: 'Average',
    color: '#f59e0b',
    icon: <Minus size={16} />,
  };
  if (relPos <= 30) {
    priceAssessment = { label: 'Near Historical Low — Great time to buy!', color: '#10b981', icon: <TrendingDown size={16} /> };
  } else if (relPos >= 70) {
    priceAssessment = { label: 'Near Historical High — Consider waiting', color: '#f43f5e', icon: <TrendingUp size={16} /> };
  }

  function handleAddAlert() {
    const target = parseFloat(alertTarget);
    if (!alertTarget || isNaN(target) || target <= 0) return;
    addAlert({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      targetPrice: target,
      currency: selectedProduct.currency,
    });
    setAlerts(getAlerts());
    setAlertTarget('');
    setAlertSaved(true);
    setTimeout(() => setAlertSaved(false), 3000);
  }

  function handleRemoveAlert(id: string) {
    removeAlert(id);
    setAlerts(getAlerts());
  }

  const productAlerts = alerts.filter((a) => a.productId === selectedProduct.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="section-title">Price Intelligence</h1>
        <p className="section-subtitle">
          Sample price history charts · All prices are simulated demo data, not live marketplace prices
        </p>
      </div>

      {/* Product Selector */}
      <div className="glass-card p-5 mb-6">
        <label htmlFor="product-select" className="block mb-3" style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
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
        {/* Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>
                {selectedProduct.name}
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: 2 }}>
                Simulated price history · Apr 2024 – Oct 2024
              </p>
            </div>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{
                background: `${priceAssessment.color}18`,
                border: `1px solid ${priceAssessment.color}40`,
                color: priceAssessment.color,
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              {priceAssessment.icon}
              {priceAssessment.label}
            </div>
          </div>

          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.08)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#475569', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(139,92,246,0.15)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#475569', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine y={minPrice} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Min', fill: '#10b981', fontSize: 10 }} />
                <ReferenceLine y={maxPrice} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'Max', fill: '#f43f5e', fontSize: 10 }} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  fill="url(#priceGradient)"
                  dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: '#c4b5fd' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p style={{ fontSize: '0.72rem', color: '#334155', marginTop: 12, textAlign: 'center' }}>
            <Info size={11} style={{ display: 'inline', marginRight: 4 }} />
            All price data shown is simulated for demonstration purposes and does not reflect real market prices.
          </p>
        </div>

        {/* Stats + Alert panel */}
        <div className="flex flex-col gap-4">
          {/* Price Stats */}
          <div className="glass-card p-5">
            <h3 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem', marginBottom: 16 }}>
              Sample Price Statistics
            </h3>
            {[
              { label: 'Current (demo)', value: `${selectedProduct.currency}${currentPrice.toLocaleString()}`, color: '#f1f5f9' },
              { label: 'Historical low', value: `${selectedProduct.currency}${minPrice.toLocaleString()}`, color: '#10b981' },
              { label: 'Historical high', value: `${selectedProduct.currency}${maxPrice.toLocaleString()}`, color: '#f43f5e' },
              { label: 'Average', value: `${selectedProduct.currency}${avgPrice.toLocaleString()}`, color: '#fbbf24' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between py-2.5"
                style={{ borderBottom: '1px solid rgba(139,92,246,0.06)' }}
              >
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{stat.label}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: stat.color }}>{stat.value}</span>
              </div>
            ))}
            <div className="mt-3">
              <p style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.5 }}>
                Current price is at{' '}
                <strong style={{ color: priceAssessment.color }}>{Math.round(relPos)}%</strong> of the
                sample price range — {relPos <= 30 ? 'near historical lows' : relPos >= 70 ? 'near historical highs' : 'in the middle range'}.
              </p>
            </div>
          </div>

          {/* Price Alert */}
          <div className="glass-card p-5">
            <h3 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem', marginBottom: 4 }}>
              <Bell size={16} style={{ display: 'inline', marginRight: 6, color: '#a78bfa' }} />
              Demo Price Alert
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: 14 }}>
              Set a target price. This is a local demo — no real notifications are sent.
            </p>

            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <span
                  className="absolute"
                  style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: '0.875rem' }}
                >
                  {selectedProduct.currency}
                </span>
                <input
                  id="alert-target-price"
                  className="input-field"
                  style={{ paddingLeft: '28px' }}
                  type="number"
                  placeholder="Target price"
                  value={alertTarget}
                  onChange={(e) => setAlertTarget(e.target.value)}
                  aria-label="Target price for alert"
                />
              </div>
              <button className="btn-primary" style={{ padding: '10px 16px' }} onClick={handleAddAlert} id="set-alert-btn">
                Set
              </button>
            </div>

            {alertSaved && (
              <div
                className="flex items-center gap-2 p-2 rounded-lg mb-3"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', fontSize: '0.78rem', color: '#34d399' }}
              >
                <CheckCircle size={14} /> Demo alert saved locally
              </div>
            )}

            {/* List of alerts for this product */}
            {productAlerts.length > 0 && (
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 8 }}>Your demo alerts:</p>
                {productAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between py-2 px-3 mb-1 rounded-xl"
                    style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}
                  >
                    <span style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: 600 }}>
                      {alert.currency}{alert.targetPrice.toLocaleString()}
                    </span>
                    <button
                      style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}
                      onClick={() => handleRemoveAlert(alert.id)}
                      aria-label="Remove alert"
                    >
                      <BellOff size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
