import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/hooks/useLanguage'
import { getProducts } from '@/hooks/productStore'
import { ShoppingCart, Heart, Star, Minus, Plus, Share2, Truck, Battery, Gauge } from 'lucide-react'

export default function ProductDetail() {
  const { t } = useLanguage()
  const params = useParams<{ slug: string }>()
  const slug = params.slug || ''
  const addItem = useCart((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description')

  // Get product from store (works with admin-added products)
  const product = useMemo(() => {
    const all = getProducts()
    return all.find((p) => p.slug === slug || String(p.id) === slug)
  }, [slug])

  if (!product) {
    return (
      <div className="min-h-screen bg-black pt-[70px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">{t('nav.home') === 'الرئيسية' ? 'المنتج غير موجود' : 'Product not found'}</p>
          <Link to="/store" className="text-[#01D7D5] hover:underline">{t('cart.continue')}</Link>
        </div>
      </div>
    )
  }

  const image = product.image || '/product-ebike-premium.jpg'
  const specs = product.specs || {}
  const price = parseInt(product.salePrice || product.price)

  const handleAddToCart = () => {
    addItem({ productId: product.id, name: product.name, price, image, quantity })
  }

  const quickSpecs = [
    { icon: <Battery size={16} />, label: specs.Range || specs.range || '65km Range' },
    { icon: <Gauge size={16} />, label: specs.Speed || specs.speed || '45km/h' },
    { icon: <Truck size={16} />, label: specs.Motor || specs.motor || '500W Motor' },
  ]

  return (
    <div className="min-h-screen bg-black pt-[70px]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[5vw] py-12">
        <div className="flex items-center gap-2 text-sm text-[#484F58] mb-8">
          <Link to="/" className="hover:text-[#01D7D5]">{t('nav.home')}</Link>
          <span>/</span>
          <Link to="/store" className="hover:text-[#01D7D5]">{t('nav.store')}</Link>
          <span>/</span>
          <span className="text-[#8B949E]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#161B22] border border-[#30363D]">
            <img src={image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <h1 className="text-white font-semibold text-3xl md:text-4xl mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.round(product.rating || 0) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-[#8B949E] text-sm">{product.rating} {t('nav.home') === 'الرئيسية' ? 'من 5' : 'out of 5'} ({product.reviewCount} {t('product.reviews')})</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-[#01D7D5] font-semibold text-3xl">{price.toLocaleString()} DZD</span>
              {product.salePrice && (
                <span className="text-[#484F58] text-xl line-through">{parseInt(product.price).toLocaleString()} DZD</span>
              )}
            </div>

            <span className="inline-block bg-[rgba(1,215,213,0.15)] text-[#01D7D5] text-xs px-3 py-1 rounded mb-4">{t('product.inStock')}</span>
            <p className="text-[#8B949E] leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center gap-4 mb-6">
              {quickSpecs.map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 text-sm text-[#8B949E]">
                  <span className="text-[#01D7D5]">{s.icon}</span>{s.label}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-[#8B949E] text-sm">{t('nav.home') === 'الرئيسية' ? 'الكمية:' : 'Quantity:'}</span>
              <div className="flex items-center border border-[#30363D] rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-[#8B949E] hover:text-white"><Minus size={16} /></button>
                <span className="px-3 py-2 text-white min-w-[40px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-[#8B949E] hover:text-white"><Plus size={16} /></button>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button onClick={handleAddToCart} className="flex-1 py-4 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all flex items-center justify-center gap-2">
                <ShoppingCart size={18} />{t('products.addToCart')}
              </button>
              <button className="px-4 py-4 border border-[#30363D] rounded-lg text-[#8B949E] hover:border-[#01D7D5]"><Heart size={18} /></button>
              <button className="px-4 py-4 border border-[#30363D] rounded-lg text-[#8B949E] hover:border-[#01D7D5]"><Share2 size={18} /></button>
            </div>
          </div>
        </div>

        <div className="border-b border-[#30363D] mb-8">
          <div className="flex gap-6">
            {(['description', 'specs'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'text-[#01D7D5] border-[#01D7D5]' : 'text-[#8B949E] border-transparent hover:text-white'}`}>
                {tab === 'specs' ? t('product.specs') : t('product.features')}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'description' ? (
          <p className="text-white leading-relaxed max-w-3xl">{product.description}</p>
        ) : (
          <div className="max-w-2xl">
            {Object.entries(specs).map(([key, value], idx) => (
              <div key={key} className={`grid grid-cols-2 p-4 text-sm ${idx % 2 === 0 ? 'bg-[#0A0A0A]' : 'bg-[#161B22]'}`}>
                <span className="text-[#484F58] capitalize">{key}</span>
                <span className="text-white">{String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
