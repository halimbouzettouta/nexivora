import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import ProductCard3D from '@/components/ProductCard3D'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

const productImages: Record<string, string> = {
  'E-Ride City Pro': '/product-ebike-premium.jpg',
  'E-Ride Urban Glide': '/product-escooter-city.jpg',
  'E-Ride Trail Blazer': '/product-escooter-offroad.jpg',
  'E-Ride Mountain X': '/product-ebike-mountain.jpg',
  'E-Ride Air Helmet': '/product-accessory-helmet.jpg',
  'E-Ride Smart Lock': '/product-accessory-lock.jpg',
}

export default function FeaturedProducts() {
  const { data: products } = trpc.product.getFeatured.useQuery()
  const addItem = useCart((s) => s.addItem)

  const handleAddToCart = (product: NonNullable<typeof products>[0]) => {
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
    try {
      return typeof specs === 'string' ? JSON.parse(specs) : specs as Record<string, string>
    } catch {
      return {}
    }
  }

  return (
    <section className="w-full bg-[#0A0A0A] py-20 px-4 sm:px-6 lg:px-[5vw]">
      <div className="max-w-[1440px] mx-auto">
        <p className="font-mono text-xs tracking-[0.2em] text-[#484F58] uppercase mb-4">
          OUR COLLECTION
        </p>
        <h2
          className="text-white font-semibold leading-tight tracking-[-0.02em] mb-3"
          style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
        >
          Electric Bikes &amp; Scooters
        </h2>
        <p className="text-[#8B949E] leading-relaxed max-w-[640px] mb-12" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
          Discover our premium selection of electric mobility vehicles, built for Algerian roads.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => {
            const specs = parseSpecs(product.specs)
            const image = productImages[product.name] || '/product-ebike-premium.jpg'
            return (
              <ProductCard3D key={product.id}>
                <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden group">
                  <Link to={`/store/${product.id}`} className="block">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/store/${product.id}`}>
                      <h4 className="text-white font-medium text-base mb-1">{product.name}</h4>
                    </Link>
                    <p className="text-[#8B949E] text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-2 text-xs text-[#484F58] mb-3 flex-wrap">
                      {specs && Object.entries(specs).slice(0, 3).map(([k, v]) => (
                        <span key={k} className="flex items-center gap-1">
                          <span className="text-[#484F58]">·</span>
                          {String(v)}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#01D7D5] font-semibold text-lg">
                        {parseFloat(product.salePrice || product.price).toLocaleString()} DZD
                      </span>
                      {product.salePrice && (
                        <span className="text-[#484F58] text-sm line-through">
                          {parseFloat(product.price).toLocaleString()} DZD
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full mt-3 py-2.5 bg-[#01D7D5] text-black font-medium text-sm rounded-lg hover:bg-[#00B4B2] transition-colors flex items-center justify-center gap-2"
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

        <div className="text-center mt-10">
          <Link
            to="/store"
            className="inline-flex items-center gap-2 text-[#8B949E] hover:text-[#01D7D5] transition-colors group"
          >
            View All Products
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
