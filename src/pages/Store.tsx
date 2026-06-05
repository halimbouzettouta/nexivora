import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { trpc } from '@/providers/trpc'
import ProductCard3D from '@/components/ProductCard3D'
import { ShoppingCart, Search } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

const productImages: Record<string, string> = {
  'E-Ride City Pro': '/product-ebike-premium.jpg',
  'E-Ride Urban Glide': '/product-escooter-city.jpg',
  'E-Ride Trail Blazer': '/product-escooter-offroad.jpg',
  'E-Ride Mountain X': '/product-ebike-mountain.jpg',
  'E-Ride Air Helmet': '/product-accessory-helmet.jpg',
  'E-Ride Smart Lock': '/product-accessory-lock.jpg',
}

const categoryTabs = ['All', 'E-Bikes', 'E-Scooters', 'Accessories', 'Parts']

export default function Store() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<string>('featured')
  const addItem = useCart((s) => s.addItem)

  const activeCategory = searchParams.get('category') || 'all'
  const activeTab = activeCategory === 'e-bikes' ? 'E-Bikes' : activeCategory === 'e-scooters' ? 'E-Scooters' : activeCategory === 'accessories' ? 'Accessories' : activeCategory === 'parts' ? 'Parts' : 'All'

  const { data, isLoading } = trpc.product.list.useQuery({
    category: activeCategory,
    search: search || undefined,
    sortBy: sortBy as 'featured' | 'price_asc' | 'price_desc' | 'rating',
    page: 1,
    limit: 24,
  })

  const handleCategoryChange = (tab: string) => {
    const slug = tab === 'E-Bikes' ? 'e-bikes' : tab === 'E-Scooters' ? 'e-scooters' : tab === 'Accessories' ? 'accessories' : tab === 'Parts' ? 'parts' : 'all'
    if (slug === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', slug)
    }
    setSearchParams(searchParams)
  }

  const handleAddToCart = (product: NonNullable<typeof data>['items'][0]) => {
    const image = productImages[product.name] || '/product-ebike-premium.jpg'
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.salePrice || product.price),
      image,
      quantity: 1,
    })
  }

  const parseSpecs = (specs: unknown) => {
    if (!specs) return {}
    try { return typeof specs === 'string' ? JSON.parse(specs) : specs as Record<string, string> } catch { return {} }
  }

  return (
    <div className="min-h-screen bg-black pt-[70px]">
      {/* Header */}
      <div className="bg-black pt-16 pb-8 px-4 sm:px-6 lg:px-[5vw]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2 text-sm text-[#484F58] mb-4">
            <Link to="/" className="hover:text-[#01D7D5]">Home</Link>
            <span>/</span>
            <span className="text-[#8B949E]">Store</span>
          </div>
          <h1 className="text-white font-semibold text-4xl md:text-5xl mb-2">All Products</h1>
          <p className="text-[#8B949E] text-sm">Showing {data?.total || 0} products</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-[70px] z-40 bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border-b border-[#30363D] px-4 sm:px-6 lg:px-[5vw] py-4">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categoryTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleCategoryChange(tab)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]'
                    : 'text-[#8B949E] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#161B22] border border-[#30363D] text-white text-sm rounded-lg pl-9 pr-4 py-2 w-48 focus:border-[#01D7D5] focus:outline-none transition-colors"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#161B22] border border-[#30363D] text-white text-sm rounded-lg px-3 py-2 focus:border-[#01D7D5] focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 sm:px-6 lg:px-[5vw] py-8">
        <div className="max-w-[1440px] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#161B22] rounded-xl h-[400px] animate-shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.items?.map((product) => {
                const specs = parseSpecs(product.specs)
                const image = productImages[product.name] || '/product-ebike-premium.jpg'
                return (
                  <ProductCard3D key={product.id}>
                    <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden group h-full flex flex-col">
                      <Link to={`/store/${product.id}`} className="block">
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <img
                            src={image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          {product.salePrice && (
                            <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-medium px-2 py-1 rounded">
                              SALE
                            </span>
                          )}
                        </div>
                      </Link>
                      <div className="p-4 flex-1 flex flex-col">
                        <Link to={`/store/${product.id}`}>
                          <h4 className="text-white font-medium text-sm mb-1">{product.name}</h4>
                        </Link>
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-yellow-500 text-xs">{'★'.repeat(Math.round(parseFloat(product.rating || '0')))}</span>
                          <span className="text-[#484F58] text-xs">({product.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[#01D7D5] font-semibold">
                            {parseFloat(product.salePrice || product.price).toLocaleString()} DZD
                          </span>
                          {product.salePrice && (
                            <span className="text-[#484F58] text-sm line-through">
                              {parseFloat(product.price).toLocaleString()} DZD
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#484F58] mb-3 flex-wrap">
                          {Object.entries(specs).slice(0, 2).map(([k, v]) => (
                            <span key={k} className="flex items-center gap-1">
                              <span>·</span>
                              {String(v)}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full mt-auto py-2.5 bg-[#01D7D5] text-black font-medium text-sm rounded-lg hover:bg-[#00B4B2] transition-colors flex items-center justify-center gap-2"
                        >
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </ProductCard3D>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
