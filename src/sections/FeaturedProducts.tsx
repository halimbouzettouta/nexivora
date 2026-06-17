import { Link } from 'react-router'
import { useProducts } from '@/hooks/useProducts'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/hooks/useLanguage'
import { ShoppingCart, ArrowRight } from 'lucide-react'

export default function FeaturedProducts() {
  const { t, lang } = useLanguage()
  const { featuredQuery } = useProducts()
  const addItem = useCart((s) => s.addItem)
  const { data: products = [], isLoading } = featuredQuery()

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
          <div className="text-center py-12">
            <p className="text-[#484F58]">{lang === 'ar' ? 'جار التحميل...' : lang === 'fr' ? 'Chargement...' : 'Loading products...'}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#484F58]">{lang === 'ar' ? 'لا توجد منتجات' : lang === 'fr' ? 'Aucun produit' : 'No products available'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <div key={product.id} className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden hover:-translate-y-2 hover:border-[rgba(255,255,255,0.1)] transition-all duration-500 group">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="aspect-[4/3] bg-[#0A0A0A] overflow-hidden relative">
                    <img
                      src={Array.isArray(product.images) ? `/product-${product.images[0]}.jpg` : (product.image || '/product-ebike-premium.jpg')}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
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
                    onClick={() => addItem({ productId: product.id, name: product.name, price: parseFloat(product.salePrice || product.price), image: Array.isArray(product.images) ? `/product-${product.images[0]}.jpg` : (product.image || ''), quantity: 1 })}
                    className="w-full py-2.5 bg-[#01D7D5] text-black text-sm font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={14} /> {t('products.addToCart')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/store"
            className="inline-flex items-center gap-2 text-[#8B949E] hover:text-[#01D7D5] transition-colors group"
          >
            {t('featured.viewAll')}
            <span className="group-hover:translate-x-1 transition-transform"><ArrowRight size={16} /></span>
          </Link>
        </div>
      </div>
    </section>
  )
}
