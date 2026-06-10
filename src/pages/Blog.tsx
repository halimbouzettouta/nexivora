import { useState } from 'react'
import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'

const categoryFilters = ['All', 'Battery Care', 'Maintenance', 'Safety', 'Technology', 'News']

const articleImages: Record<string, string> = {
  'How to Extend Your Battery Life': '/article-battery.jpg',
  'Best Charging Practices for E-Scooters': '/article-charging.jpg',
  'Safety Tips for Riding in Algerian Cities': '/article-safety.jpg',
  'Understanding Your E-Bike Motor': '/article-motor.jpg',
}

const categoryColors: Record<string, string> = {
  'Battery Care': '#01D7D5',
  'Maintenance': '#F59E0B',
  'Safety': '#EF4444',
  'Technology': '#3B82F6',
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All')
  const { data } = trpc.article.list.useQuery({
    category: activeCategory === 'All' ? undefined : activeCategory,
    limit: 12,
  })

  const articles = data?.items || []
  const featured = articles[0]
  const rest = articles.slice(1)

  return (
    <div className="min-h-screen bg-black pt-[70px]">
      <div className="bg-black pt-16 pb-8 px-4 sm:px-6 lg:px-[5vw]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 text-sm text-[#484F58] mb-4">
            <Link to="/" className="hover:text-[#01D7D5]">Home</Link>
            <span>/</span>
            <span className="text-[#8B949E]">Blog</span>
          </div>
          <h1 className="text-white font-semibold text-4xl md:text-5xl mb-6">Tips, Guides & News</h1>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categoryFilters.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]'
                    : 'text-[#8B949E] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-[5vw] py-8">
        {/* Featured Article */}
        {featured && (
          <Link to={`/blog/${featured.slug}`} className="block mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden group">
              <div className="aspect-video lg:aspect-auto overflow-hidden">
                <img
                  src={articleImages[featured.title] || '/product-ebike-premium.jpg'}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className="inline-block bg-[#01D7D5] text-black text-[11px] font-semibold tracking-wider px-3 py-1 rounded mb-4 w-fit">
                  FEATURED
                </span>
                <span
                  className="text-xs font-medium mb-2"
                  style={{ color: categoryColors[featured.category] || '#01D7D5' }}
                >
                  {featured.category}
                </span>
                <h2 className="text-white font-semibold text-2xl md:text-3xl mb-3 group-hover:text-[#01D7D5] transition-colors">
                  {featured.title}
                </h2>
                <p className="text-[#8B949E] leading-relaxed mb-4">{featured.excerpt}</p>
                <span className="text-[#01D7D5] text-sm font-medium inline-flex items-center gap-1">
                  Read Article →
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((article) => (
            <Link to={`/blog/${article.slug}`} key={article.id} className="group">
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden h-full">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={articleImages[article.title] || '/product-ebike-premium.jpg'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <span
                    className="text-xs font-medium mb-2 inline-block"
                    style={{ color: categoryColors[article.category] || '#01D7D5' }}
                  >
                    {article.category}
                  </span>
                  <h4 className="text-white font-medium mb-2 group-hover:text-[#01D7D5] transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-[#8B949E] text-sm line-clamp-2">{article.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
