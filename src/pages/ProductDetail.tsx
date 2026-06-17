import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/hooks/useLanguage'
import { useProducts } from '@/hooks/useProducts'
import { ShoppingCart, Heart, Star, Minus, Plus, Share2, Truck, Battery, Gauge } from 'lucide-react'

export default function ProductDetail() {
  const { t, lang } = useLanguage()
  const params = useParams<{ slug: string }>()
  const slug = params.slug || ''
  const addItem = useCart((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description')
  const { getById } = useProducts()

  // Try to parse slug as ID first, otherwise it's a slug
  const productId = parseInt(slug)
  const isNumericId = !isNaN(productId)

  const { data: apiProduct, isLoading } = getById(isNumericId ? productId : 1)

  // If slug is not numeric, we still show the product with ID 1 as fallback
  // In a real app you'd have a getBySlug endpoint
  const product = isNumericId ? apiProduct : null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-[90px] flex items-center justify-center">
        <p className="text-[#484F58]">Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black pt-[90px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">{lang === 'ar' ? 'المنتج غير موجود' : lang === 'fr' ? 'Produit non trouvé' : 'Product not found'}</p>
          <Link to="/store" className="text-[#01D7D5] hover:underline">{t('cart.continue')}</Link>
        </div>
      </div>
    )
  }

  const image = Array.isArray(product.images) ? `/product-${product.images[0]}.jpg` : (product.image || '/product-ebike-premium.jpg')
  const specs = typeof product.specs === 'string' ? JSON.parse(product.specs) : (product.specs || {})
  const price = parseFloat(product.salePrice || product.price)
  const rawPrice = parseFloat(product.price)

  const handleAddToCart = () => {
    addItem({ productId: product.id, name: product.name, price, image, quantity })
  }

  return (
    <div className="min-h-screen bg-black pt-[90px]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-[5vw] py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square bg-[#161B22] rounded-2xl overflow-hidden border border-[#30363D]">
            <img src={image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-white font-semibold text-3xl md:text-4xl mb-4">{product.name}</h1>
            <p className="text-[#8B949E] leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-[#01D7D5] font-semibold text-3xl">DZD {price.toLocaleString()}</span>
              {product.salePrice && price < rawPrice && (
                <span className="text-[#484F58] text-lg line-through">DZD {rawPrice.toLocaleString()}</span>
              )}
              {product.salePrice && price < rawPrice && (
                <span className="bg-[#EF4444] text-white text-xs font-bold px-2 py-1 rounded-full">{Math.round((1 - price / rawPrice) * 100)}% OFF</span>
              )}
            </div>

            {/* Specs mini */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: <Battery size={20} />, label: specs.battery || '48V Battery', sub: 'Battery' },
                { icon: <Gauge size={20} />, label: specs.motor || '500W Motor', sub: 'Motor' },
                { icon: <Truck size={20} />, label: specs.range || '65km Range', sub: 'Range' },
              ].map((s) => (
                <div key={s.sub} className="bg-[#161B22] border border-[#30363D] rounded-lg p-3 text-center">
                  <div className="text-[#01D7D5] mb-1 flex justify-center">{s.icon}</div>
                  <p className="text-white text-sm font-medium">{s.label}</p>
                  <p className="text-[#484F58] text-[10px]">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Quantity + Add */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center bg-[#161B22] border border-[#30363D] rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-white hover:text-[#01D7D5]"><Minus size={16} /></button>
                <span className="px-4 text-white font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-white hover:text-[#01D7D5]"><Plus size={16} /></button>
              </div>
              <button onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-[#01D7D5] text-black font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(1,215,213,0.4)] transition-all flex items-center justify-center gap-2">
                <ShoppingCart size={18} /> {t('products.addToCart')}
              </button>
              <button className="p-3.5 border border-[#30363D] rounded-lg text-[#484F58] hover:text-[#EF4444] hover:border-[#EF4444] transition-all"><Heart size={18} /></button>
            </div>

            {/* Tabs */}
            <div className="border-b border-[#30363D] mb-4">
              <div className="flex gap-6">
                {(['description', 'specs'] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium transition-colors ${activeTab === tab ? 'text-[#01D7D5] border-b-2 border-[#01D7D5]' : 'text-[#484F58] hover:text-white'}`}>
                    {tab === 'description' ? (lang === 'ar' ? 'الوصف' : lang === 'fr' ? 'Description' : 'Description') : (lang === 'ar' ? 'المواصفات' : lang === 'fr' ? 'Spécifications' : 'Specifications')}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'description' ? (
              <p className="text-[#8B949E] text-sm leading-relaxed">{product.description}</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between bg-[#161B22] rounded-lg px-4 py-2">
                    <span className="text-[#484F58] text-xs capitalize">{key}</span>
                    <span className="text-white text-sm">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
