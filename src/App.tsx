import React, { useState, useEffect, useCallback } from 'react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import ComparePage from './pages/ComparePage'
import PriceIntelligencePage from './pages/PriceIntelligencePage'
import ReviewInsightsPage from './pages/ReviewInsightsPage'
import BudgetPage from './pages/BudgetPage'
import WishlistPage from './pages/WishlistPage'
import ProductDetailModal from './components/ProductDetailModal'
import { Product } from './data/products'
import { getWishlist, getCompareList } from './utils/storage'

type Page =
  | 'home'
  | 'explore'
  | 'compare'
  | 'price-intelligence'
  | 'reviews'
  | 'budget'
  | 'wishlist'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [wishlistCount, setWishlistCount] = useState(0)
  const [compareCount, setCompareCount] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const refreshCounts = useCallback(() => {
    setWishlistCount(getWishlist().length)
    setCompareCount(getCompareList().length)
  }, [])

  useEffect(() => {
    refreshCounts()
    // Listen for cross-tab storage changes
    window.addEventListener('storage', refreshCounts)
    return () => window.removeEventListener('storage', refreshCounts)
  }, [refreshCounts])

  function handleProductView(product: Product) {
    setSelectedProduct(product)
    setModalOpen(true)
  }

  function handleNavigate(page: Page) {
    setCurrentPage(page)
    setModalOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    refreshCounts()
  }

  function renderPage() {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={handleNavigate}
            onProductView={handleProductView}
          />
        )
      case 'explore':
        return <ExplorePage onProductView={handleProductView} />
      case 'compare':
        return (
          <ComparePage
            onNavigateExplore={() => handleNavigate('explore')}
          />
        )
      case 'price-intelligence':
        return <PriceIntelligencePage initialProduct={selectedProduct} />
      case 'reviews':
        return <ReviewInsightsPage initialProduct={selectedProduct} />
      case 'budget':
        return <BudgetPage onProductView={handleProductView} />
      case 'wishlist':
        return (
          <WishlistPage
            onProductView={handleProductView}
            onNavigateExplore={() => handleNavigate('explore')}
            onWishlistChange={refreshCounts}
          />
        )
      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            onProductView={handleProductView}
          />
        )
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060b18' }}>
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        wishlistCount={wishlistCount}
        compareCount={compareCount}
      />

      <main>
        {renderPage()}
      </main>

      {modalOpen && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => {
            setModalOpen(false)
            refreshCounts()
          }}
          onNavigatePriceIntel={() => {
            setModalOpen(false)
            handleNavigate('price-intelligence')
          }}
          onNavigateReviews={() => {
            setModalOpen(false)
            handleNavigate('reviews')
          }}
          onWishlistChange={refreshCounts}
          onCompareChange={refreshCounts}
        />
      )}
    </div>
  )
}
