import { Link } from 'react-router'
import { useProducts } from '@/hooks/useProducts'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/hooks/useLanguage'
import { ShoppingCart, ArrowRight } from 'lucide-react'

// Fallback products when API is unavailable
const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Nexivora City Pro', description: 'Premium foldable electric bike designed for urban commuting. 500W motor, 48V 20Ah battery.', category: 'e-bikes', categoryId: 1, price: '185000', salePrice: '169000', stock: 15, images: ['ebike-premium'], image: '/product-ebike-premium.jpg', rating: '4.5', reviewCount: 24 },
  { id: 2, name: 'Nexivora Urban Glide', description: 'Sleek urban commuter scooter with dual suspension and 10-inch pneumatic tires.', category: 'e-scooters', categoryId: 2, price: '125000', salePrice: null, stock: 22, images: ['escooter-city'], image: '/product-escooter-city.jpg', rating: '4.3', reviewCount: 18 },
  { id: 3, name: 'Nexivora Trail Blazer', description: 'Rugged off-road electric scooter. Dual 1000W motors, all-terrain tires, IPX5 water resistance.', category: 'e-scooters', categoryId: 2, price: '285000', salePrice: '259000', stock: 8, images: ['escooter-offroad'], image: '/product-escooter-offroad.jpg', rating: '4.8', reviewCount: 12 },
]

export default function FeaturedProducts() {
  const { t, lang } = useLanguage()
  const { featuredQuery } = useProducts()
  const addItem = useCart((s) => s.addItem)
  const { data: apiProducts, isLoading } = featuredQuery()

  // Use API data if available and has items, otherwise use fallback
  const products = (apiProducts && apiProducts.length > 0) ? apiProducts : FALLBACK_PRODUCTS

  const handleAddToCart = (product: any) => {
    const image = Array.isArray(product.images) ? `/product-${product.images[0]}.jpg` : (product.image || '')
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.salePrice || product.price),
      image,
      quantity: 1,
    })
  }

  return (
    <section className="w-full bg-black py-20 px-4 sm:px-6 lg:px-[5vw]">
      <div className="max-w-[1200px] mx-auto">
        <p className="font-mono text-xs tracking-[0.2em] text-[#484F58] uppercase mb-4 text-center">
          {t('featured.title')}
        </p>
        <h2
          className="text-white font-semibold leading-tight tracking-[-0.02em] mb-10 text-center"
          style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
        >
          {t('featured.subtitle')}
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FALLBACK_PRODUCTS.map((p) => (
              <div key={p.id} className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-[#0A0A0A]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[#30363D] rounded w-3/4" />
                  <div className="h-3 bg-[#30363D] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => {
                const image = Array.isArray(product.images) ? `/product-${product.images[0]}.jpg` : (product.image || '/product-ebike-premium.jpg')
                return (
                  <div key={product.id} className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden hover:-translate-y-2 hover:border-[rgba(255,255,255,0.1)] transition-all duration-500 group">
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="aspect-[4/3] bg-[#0A0A0A] overflow-hidden relative">
                        <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        {product.salePrice && parseFloat(product.salePrice) < parseFloat(product.price) && (
                          <span className="absolute top-3 right-3 bg-[#EF4444] text-white text-[10px] font-bold px-2 py-1 rounded-full">{t('products.sale')}</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-medium text-base">{product.name}</h3>
                        <p className="text-[#484F58] text-xs mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[#01D7D5] font-semibold">DZD {parseFloat(product.salePrice || product.price).toLocaleString()}</span>
                          {product.salePrice && parseFloat(product.salePrice) < parseFloat(product.price) && (
                            <span className="text-[#484F58] text-xs line-through">{parseFloat(product.price).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                    <div className="px-4 pb-4">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-2.5 bg-[#01D7D5] text-black text-sm font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={14} /> {t('products.addToCart')}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/store"
                className="inline-flex items-center gap-2 text-[#8B949E] hover:text-[#01D7D5] transition-colors group"
              >
                {t('featured.viewAll')}
                <span className="group-hover:translate-x-1 transition-transform"><ArrowRight size={16} /></span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
