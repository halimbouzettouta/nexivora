import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useProducts } from '@/hooks/useProducts'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/hooks/useLanguage'
import { ShoppingCart, Search } from 'lucide-react'

// Fallback products when API is unavailable
const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Nexivora City Pro', description: 'Premium foldable electric bike designed for urban commuting. 500W motor, 48V 20Ah battery.', category: 'e-bikes', categoryId: 1, price: '185000', salePrice: '169000', stock: 15, images: ['ebike-premium'], image: '/product-ebike-premium.jpg', rating: '4.5', reviewCount: 24 },
  { id: 2, name: 'Nexivora Urban Glide', description: 'Sleek urban commuter scooter with dual suspension and 10-inch pneumatic tires.', category: 'e-scooters', categoryId: 2, price: '125000', salePrice: null, stock: 22, images: ['escooter-city'], image: '/product-escooter-city.jpg', rating: '4.3', reviewCount: 18 },
  { id: 3, name: 'Nexivora Trail Blazer', description: 'Rugged off-road electric scooter. Dual 1000W motors, all-terrain tires, IPX5 water resistance.', category: 'e-scooters', categoryId: 2, price: '285000', salePrice: '259000', stock: 8, images: ['escooter-offroad'], image: '/product-escooter-offroad.jpg', rating: '4.8', reviewCount: 12 },
  { id: 4, name: 'Nexivora Lite Scooter', description: 'Lightweight and compact electric scooter perfect for short commutes and quick errands.', category: 'e-scooters', categoryId: 2, price: '75000', salePrice: null, stock: 30, images: ['escooter-lite'], image: '/product-escooter-lite.jpg', rating: '4.1', reviewCount: 35 },
  { id: 5, name: 'Nexivora X1 E-Bike', description: 'High-performance electric mountain bike with full suspension, hydraulic brakes, and 750W mid-drive motor.', category: 'e-bikes', categoryId: 1, price: '245000', salePrice: '229000', stock: 10, images: ['ebike-mountain'], image: '/product-ebike-mountain.jpg', rating: '4.7', reviewCount: 15 },
  { id: 6, name: 'Nexivora Cargo Pro', description: 'Heavy-duty electric cargo bike designed for deliveries and transporting goods. 1000W motor with extended frame.', category: 'e-bikes', categoryId: 1, price: '320000', salePrice: '299000', stock: 5, images: ['ebike-cargo'], image: '/product-ebike-cargo.jpg', rating: '4.6', reviewCount: 8 },
]

const CAT_TAB_SLUG: Record<string, string> = {
  'All': 'all', 'E-Bikes': 'e-bikes', 'E-Scooters': 'e-scooters', 'Accessories': 'accessories', 'Parts': 'parts',
  '\u0627\u0644\u0643\u0644': 'all', '\u062f\u0631\u0627\u062c\u0627\u062a \u0643\u0647\u0631\u0628\u0627\u0626\u064a\u0629': 'e-bikes', '\u0633\u0643\u0648\u062a\u0631\u0627\u062a \u0643\u0647\u0631\u0628\u0627\u0626\u064a\u0629': 'e-scooters', '\u0625\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062a': 'accessories', '\u0642\u0637\u0639 \u063a\u064a\u0627\u0631': 'parts',
  'Tous': 'all', 'V\u00e9los \u00c9lec.': 'e-bikes', 'Trottinettes': 'e-scooters', 'Accessoires': 'accessories', 'Pi\u00e8ces': 'parts',
}

export default function Store() {
  const { t, lang } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const { listQuery } = useProducts()
  const addItem = useCart((s) => s.addItem)

  const isAr = lang === 'ar'
  const isFr = lang === 'fr'
  const activeCatSlug = searchParams.get('category') || 'all'
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('featured')

  // Fetch from API
  const { data: productsData, isLoading } = listQuery(activeCatSlug, search || undefined, sortBy)

  // Use API data if available and has items, otherwise use fallback
  const apiProducts = productsData?.items || []
  const products = apiProducts.length > 0 ? apiProducts : FALLBACK_PRODUCTS

  const handleCategoryChange = (tab: string) => {
    const slug = CAT_TAB_SLUG[tab] || 'all'
    if (slug === 'all') { searchParams.delete('category') } else { searchParams.set('category', slug) }
    setSearchParams(searchParams)
  }

  const handleAddToCart = (p: any) => {
    addItem({ productId: p.id, name: p.name, price: parseFloat(p.salePrice || p.price), image: Array.isArray(p.images) ? `/product-${p.images[0]}.jpg` : (p.image || ''), quantity: 1 })
  }

  const getCategoryLabel = () => {
    if (activeCatSlug === 'all') return isAr ? 'الكل' : isFr ? 'Tous' : 'All'
    return activeCatSlug
  }
  const activeTab = getCategoryLabel()

  const categoryTabs = isAr
    ? ['الكل', 'دراجات كهربائية', 'سكوترات كهربائية', 'إكسسوارات', 'قطع غيار']
    : isFr
      ? ['Tous', 'Vélos Élec.', 'Trottinettes', 'Accessoires', 'Pièces']
      : ['All', 'E-Bikes', 'E-Scooters', 'Accessories', 'Parts']

  return (
    <div className="min-h-screen bg-black pt-[90px]">
      <div className="bg-black text-center pt-32 pb-20 px-4">
        <div className="flex items-center justify-center gap-2 text-xs mb-4">
          <Link to="/" className="hover:text-[#01D7D5]">{t('nav.home')}</Link><span>/</span><span className="text-[#8B949E]">{t('nav.store')}</span>
        </div>
        <h1 className="text-white font-semibold text-4xl md:text-5xl mb-2">{t('nav.store')}</h1>
        <p className="text-[#8B949E] text-sm">{products.length} {isAr ? 'منتج' : isFr ? 'produits' : 'products'}</p>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[5vw] pb-20">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('store.search')}
              className="w-full bg-[#161B22] border border-[#30363D] text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#161B22] border border-[#30363D] text-white text-sm rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none">
            <option value="featured">{isAr ? 'الأكثر رواجاً' : isFr ? 'Populaires' : 'Featured'}</option>
            <option value="price_asc">{isAr ? 'السعر: من الأقل' : isFr ? 'Prix: Croissant' : 'Price: Low → High'}</option>
            <option value="price_desc">{isAr ? 'السعر: من الأعلى' : isFr ? 'Prix: Décroissant' : 'Price: High → Low'}</option>
            <option value="rating">{isAr ? 'الأعلى تقييماً' : isFr ? 'Mieux Notés' : 'Highest Rated'}</option>
          </select>
        </div>

        <div className="flex gap-1 mb-6 overflow-x-auto">
          {categoryTabs.map((tab) => (
            <button key={tab} onClick={() => handleCategoryChange(tab)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]' : 'text-[#484F58] hover:text-white'}`}>{tab}</button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-24"><p className="text-[#8B949E] text-lg">{isAr ? 'جار التحميل...' : isFr ? 'Chargement...' : 'Loading...'}</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <div key={product.id} className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden hover:-translate-y-2 hover:border-[rgba(255,255,255,0.1)] transition-all duration-500 group">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="aspect-[4/3] bg-[#0A0A0A] overflow-hidden relative">
                    <img src={Array.isArray(product.images) ? `/product-${product.images[0]}.jpg` : (product.image || '/product-ebike-premium.jpg')} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    {product.salePrice && parseFloat(product.salePrice) < parseFloat(product.price) && (
                      <span className="absolute top-3 right-3 bg-[#EF4444] text-white text-[10px] font-bold px-2 py-1 rounded-full">{t('products.sale')}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[#8B949E] text-[10px] uppercase tracking-[0.1em]">{product.category}</p>
                    <h3 className="text-white font-medium text-base mt-1 mb-1">{product.name}</h3>
                    <p className="text-[#484F58] text-xs mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[#01D7D5] font-semibold">DZD {parseFloat(product.salePrice || product.price).toLocaleString()}</span>
                        {product.salePrice && parseFloat(product.salePrice) < parseFloat(product.price) && <span className="text-[#484F58] text-xs line-through">{parseFloat(product.price).toLocaleString()}</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-xs">★</span>
                        <span className="text-[#484F58] text-xs">{product.rating || 0}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button onClick={() => handleAddToCart(product)}
                    className="w-full py-2.5 bg-[#01D7D5] text-black text-sm font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all flex items-center justify-center gap-2">
                    <ShoppingCart size={14} /> {t('products.addToCart')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
