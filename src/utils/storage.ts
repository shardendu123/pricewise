import { Product } from '../data/products';

const WISHLIST_KEY = 'pricewise_wishlist';
const COMPARE_KEY = 'pricewise_compare';
const ALERTS_KEY = 'pricewise_alerts';
const BUDGET_KEY = 'pricewise_budget';

// ── Wishlist ────────────────────────────────────────────
export function getWishlist(): string[] {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addToWishlist(id: string): void {
  const list = getWishlist();
  if (!list.includes(id)) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify([...list, id]));
  }
}

export function removeFromWishlist(id: string): void {
  const list = getWishlist().filter((x) => x !== id);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
}

export function isInWishlist(id: string): boolean {
  return getWishlist().includes(id);
}

// ── Compare ─────────────────────────────────────────────
export function getCompareList(): string[] {
  try {
    return JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addToCompare(id: string): boolean {
  const list = getCompareList();
  if (list.includes(id)) return true;
  if (list.length >= 4) return false; // max 4 products
  localStorage.setItem(COMPARE_KEY, JSON.stringify([...list, id]));
  return true;
}

export function removeFromCompare(id: string): void {
  const list = getCompareList().filter((x) => x !== id);
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
}

export function isInCompare(id: string): boolean {
  return getCompareList().includes(id);
}

export function clearCompare(): void {
  localStorage.setItem(COMPARE_KEY, JSON.stringify([]));
}

// ── Price Alerts ─────────────────────────────────────────
export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  targetPrice: number;
  currency: string;
  createdAt: string;
  active: boolean;
}

export function getAlerts(): PriceAlert[] {
  try {
    return JSON.parse(localStorage.getItem(ALERTS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addAlert(alert: Omit<PriceAlert, 'id' | 'createdAt' | 'active'>): void {
  const alerts = getAlerts();
  const newAlert: PriceAlert = {
    ...alert,
    id: `alert-${Date.now()}`,
    createdAt: new Date().toISOString(),
    active: true,
  };
  localStorage.setItem(ALERTS_KEY, JSON.stringify([...alerts, newAlert]));
}

export function removeAlert(id: string): void {
  const alerts = getAlerts().filter((a) => a.id !== id);
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
}

// ── Budget Prefs ──────────────────────────────────────────
export interface BudgetPrefs {
  budget: number;
  category: string;
  usage: string;
}

export function getBudgetPrefs(): BudgetPrefs | null {
  try {
    const raw = localStorage.getItem(BUDGET_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveBudgetPrefs(prefs: BudgetPrefs): void {
  localStorage.setItem(BUDGET_KEY, JSON.stringify(prefs));
}

// ── Value Score helper ────────────────────────────────────
/**
 * Value Score = weighted combination of:
 *  - Discount percentage (30%)
 *  - Rating normalised to 5 (40%)
 *  - Price vs category average (30%)
 *
 * Result is already stored on each product (0-100).
 */
export function computeValueScore(product: Product, categoryProducts: Product[]): number {
  const discountPct = product.originalPrice
    ? ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100
    : 0;

  const ratingScore = (product.rating / 5) * 100;

  const avgPrice =
    categoryProducts.reduce((sum, p) => sum + p.currentPrice, 0) / categoryProducts.length;
  const priceScore = Math.max(0, Math.min(100, ((avgPrice - product.currentPrice) / avgPrice) * 100 + 50));

  return Math.round(discountPct * 0.3 + ratingScore * 0.4 + priceScore * 0.3);
}
