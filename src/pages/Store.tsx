import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useProducts } from '@/hooks/useProducts'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/hooks/useLanguage'
import { ShoppingCart, Search } from 'lucide-react'

const getCategoryTabs = (isAr: boolean, isFr: boolean) =>
  isAr ? ['الكل', 'دراجات كهربائية', 'سكوترات كهربائية', 'إكسسوارات', 'قطع غيار']
  : isFr ? ['Tous', 'Vélos Élec.', 'Trottinettes', 'Accessoires', 'Pièces']
  : ['All', 'E-Bikes', 'E-Scooters', 'Accessories', 'Parts']

const CAT_TAB_SLUG: Record<string, string> = {
  'All': 'all', 'E-Bikes': 'e-bikes', 'E-Scooters': 'e-scooters', 'Accessories': 'accessories', 'Parts': 'parts',
  'الكل': 'all', 'دراجات كهربائية': 'e-bikes', 'سكوترات كهربائية': 'e-scooters', 'إكسسوارات': 'accessories', 'قطع غيار': 'parts',
  'Tous': 'all', 'Vélos Élec.': 'e-bikes', 'Trottinettes': 'e-scooters', 'Pièces': 'parts',
}

export default function Store() {
  const { t, lang } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const { listQuery, categoriesQuery } = useProducts()
  const addItem = useCart((s) => s.addItem)

  const isAr = lang === 'ar'
  const activeCatSlug = searchParams.get('category') || 'all'
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('featured')

  // Fetch from REAL API
  const { data: productsData, isLoading } = listQuery(activeCatSlug, search || undefined, sortBy)
  const { data: categoriesData } = categoriesQuery()
  
  const products = productsData?.items || []
  const categories = categoriesData || []

  const handleCategoryChange = (tab: string) => {
    const slug = CAT_TAB_SLUG[tab] || 'all'
    if (slug === 'all') { searchParams.delete('category') } else { searchParams.set('category', slug) }
    setSearchParams(searchParams)
  }

  const handleAddToCart = (p: any) => {
    addItem({ productId: p.id, name: p.name, price: parseFloat(p.salePrice || p.price), image: Array.isArray(p.images) ? p.images[0] : p.image || '', quantity: 1 })
  }

  // Map DB category to display tab
  const getCategoryLabel = () => {
    if (activeCatSlug === 'all') return isAr ? 'الكل' : lang === 'fr' ? 'Tous' : 'All'
    return activeCatSlug
  }
  const activeTab = getCategoryLabel()
  const categoryTabs = getCategoryTabs(isAr, lang === 'fr')

  return (
    <div className="min-h-screen bg-black pt-[90px]">
      <div className="bg-black text-center pt-32 pb-20 px-4">
        <div className="flex items-center justify-center gap-2 text-xs mb-4">
          <Link to="/" className="hover:text-[#01D7D5]">{t('nav.home')}</Link><span>/</span><span className="text-[#8B949E]">{t('nav.store')}</span>
        </div>
        <h1 className="text-white font-semibold text-4xl md:text-5xl mb-2">{t('nav.store')}</h1>
        <p className="text-[#8B949E] text-sm">{productsData?.total || 0} {isAr ? 'منتج' : lang === 'fr' ? 'produits' : 'products'}</p>
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
            <option value="featured">{isAr ? 'الأكثر رواجاً' : lang === 'fr' ? 'Trier : Populaires' : 'Sort: Featured'}</option>
            <option value="price_asc">{isAr ? 'السعر: من الأقل للأعلى' : lang === 'fr' ? 'Prix : Croissant' : 'Price: Low → High'}</option>
            <option value="price_desc">{isAr ? 'السعر: من الأعلى للأقل' : lang === 'fr' ? 'Prix : Décroissant' : 'Price: High → Low'}</option>
            <option value="rating">{isAr ? 'الأعلى تقييماً' : lang === 'fr' ? 'Mieux Notés' : 'Highest Rated'}</option>
          </select>
        </div>

        <div className="flex gap-1 mb-6 overflow-x-auto">
          {categoryTabs.map((tab) => (
            <button key={tab} onClick={() => handleCategoryChange(tab)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]' : 'text-[#484F58] hover:text-white'}`}>{tab}</button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-24"><p className="text-[#8B949E] text-lg">{isAr ? 'جار التحميل...' : lang === 'fr' ? 'Chargement...' : 'Loading products...'}</p></div>
        ) : products.length === 0 ? (
          <div className="text-center py-24"><p className="text-[#8B949E] text-lg">{t('store.noResults')}</p></div>
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
                    <p className="text-[#8B949E] text-[10px] uppercase tracking-[0.1em]">{categories.find((c: any) => c.id === product.categoryId)?.name || 'Product'}</p>
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
