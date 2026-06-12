import { Link } from 'react-router'
import { useProducts, type Product } from '@/hooks/useProducts'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/hooks/useLanguage'

export default function FeaturedProducts() {
  const { products } = useProducts()
  const addItem = useCart((s) => s.addItem)
  const { t } = useLanguage()

  const handleAddToCart = (p: Product) => {
    addItem({
      productId: p.id,
      name: p.name,
      price: parseInt(p.salePrice || p.price),
      image: p.image || '/product-ebike-premium.jpg',
      quantity: 1,
    })
  }

  return (
    <section id="products" className="w-full bg-black py-20 px-4 sm:px-6 lg:px-[5vw]">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-xs tracking-[0.2em] text-[#484F58] uppercase mb-4">{t('products.title')}</p>
          <h2 className="text-white font-semibold leading-tight tracking-[-0.02em] mb-3" style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}>{t('products.subtitle')}</h2>
          <p className="text-[#8B949E] leading-relaxed max-w-[640px] mx-auto mb-12" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>{t('products.desc')}</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#484F58]">No products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.filter((p) => p.status === 'active').map((product) => (
              <div key={product.id} className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden hover:-translate-y-2 hover:border-[rgba(255,255,255,0.1)] transition-all duration-500 group">
                <Link to={`/product/${product.slug}`} className="block">
                  <div className="aspect-[4/3] bg-[#0A0A0A] overflow-hidden relative">
                    <img src={product.image || '/product-ebike-premium.jpg'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    {product.salePrice && parseInt(String(product.salePrice)) < parseInt(String(product.price)) && (
                      <span className="absolute top-3 right-3 bg-[#EF4444] text-white text-[10px] font-bold px-2 py-1 rounded-full">{t('products.sale')}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[#8B949E] text-[10px] uppercase tracking-[0.1em]">{product.category}</p>
                    <h3 className="text-white font-medium text-base mt-1 mb-1">{product.name}</h3>
                    <p className="text-[#484F58] text-xs mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[#01D7D5] font-semibold">DZD {parseInt(product.salePrice || product.price).toLocaleString()}</span>
                        {product.salePrice && <span className="text-[#484F58] text-xs line-through">{parseInt(product.price).toLocaleString()}</span>}
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

        <div className="text-center mt-12">
          <Link to="/store" className="inline-flex items-center gap-2 text-[#01D7D5] text-sm hover:underline transition-colors">
            {t('products.viewAll')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
