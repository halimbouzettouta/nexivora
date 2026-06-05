import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useCart } from '@/hooks/useCart'
import { ShoppingCart, Heart, Star, Minus, Plus, Share2, Truck, Battery, Gauge } from 'lucide-react'

const productImages: Record<number, string> = {
  1: '/product-ebike-premium.jpg',
  2: '/product-escooter-city.jpg',
  3: '/product-escooter-offroad.jpg',
  4: '/product-ebike-mountain.jpg',
  5: '/product-accessory-helmet.jpg',
  6: '/product-accessory-lock.jpg',
}

export default function ProductDetail() {
  const params = useParams<{ slug: string }>()
  const productId = parseInt(params.slug || '1')
  const { data: product } = trpc.product.getById.useQuery({ id: productId })
  const addItem = useCart((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description')

  if (!product) {
    return (
      <div className="min-h-screen bg-black pt-[70px] flex items-center justify-center">
        <div className="animate-shimmer w-96 h-96 rounded-xl" />
      </div>
    )
  }

  const image = productImages[product.id] || '/product-ebike-premium.jpg'
  const specs = product.specs ? (typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs) as Record<string, string> : {}

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.salePrice || product.price),
      image,
      quantity,
    })
  }

  const quickSpecs = [
    { icon: <Battery size={16} />, label: specs.range || '65km Range' },
    { icon: <Gauge size={16} />, label: specs.speed || '45km/h' },
    { icon: <Truck size={16} />, label: specs.motor || '500W Motor' },
  ]

  return (
    <div className="min-h-screen bg-black pt-[70px]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[5vw] py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#484F58] mb-8">
          <Link to="/" className="hover:text-[#01D7D5]">Home</Link>
          <span>/</span>
          <Link to="/store" className="hover:text-[#01D7D5]">Store</Link>
          <span>/</span>
          <span className="text-[#8B949E]">{product.name}</span>
        </div>

        {/* Product Main */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Gallery */}
          <div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#161B22] border border-[#30363D]">
              <img src={image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-white font-semibold text-3xl md:text-4xl mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.round(parseFloat(product.rating || '0')) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-[#8B949E] text-sm">{product.rating} out of 5 ({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-[#01D7D5] font-semibold text-3xl">{parseFloat(product.salePrice || product.price).toLocaleString()} DZD</span>
              {product.salePrice && (
                <span className="text-[#484F58] text-xl line-through">{parseFloat(product.price).toLocaleString()} DZD</span>
              )}
            </div>

            <span className="inline-block bg-[rgba(1,215,213,0.15)] text-[#01D7D5] text-xs px-3 py-1 rounded mb-4">
              In Stock
            </span>

            <p className="text-[#8B949E] leading-relaxed mb-6">{product.description}</p>

            {/* Quick Specs */}
            <div className="flex items-center gap-4 mb-6">
              {quickSpecs.map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 text-sm text-[#8B949E]">
                  <span className="text-[#01D7D5]">{s.icon}</span>
                  {s.label}
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[#8B949E] text-sm">Quantity:</span>
              <div className="flex items-center border border-[#30363D] rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-[#8B949E] hover:text-white">
                  <Minus size={16} />
                </button>
                <span className="px-3 py-2 text-white min-w-[40px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-[#8B949E] hover:text-white">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button className="px-4 py-4 border border-[#30363D] rounded-lg text-[#8B949E] hover:border-[#01D7D5] hover:text-[#01D7D5] transition-colors">
                <Heart size={18} />
              </button>
              <button className="px-4 py-4 border border-[#30363D] rounded-lg text-[#8B949E] hover:border-[#01D7D5] hover:text-[#01D7D5] transition-colors">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#30363D] mb-8">
          <div className="flex gap-6">
            {(['description', 'specs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab ? 'text-[#01D7D5] border-[#01D7D5]' : 'text-[#8B949E] border-transparent hover:text-white'
                }`}
              >
                {tab === 'specs' ? 'Specifications' : tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'description' ? (
          <p className="text-white leading-relaxed max-w-3xl">{product.description}</p>
        ) : (
          <div className="max-w-2xl">
            {Object.entries(specs).map(([key, value], idx) => (
              <div
                key={key}
                className={`grid grid-cols-2 p-4 text-sm ${idx % 2 === 0 ? 'bg-[#0A0A0A]' : 'bg-[#161B22]'}`}
              >
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
