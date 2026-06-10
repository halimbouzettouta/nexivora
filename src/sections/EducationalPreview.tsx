import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { ArrowRight } from 'lucide-react'

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

export default function EducationalPreview() {
  const { data: articlesList } = trpc.article.list.useQuery({ limit: 4 })

  return (
    <section className="w-full bg-[#0A0A0A] py-20 px-4 sm:px-6 lg:px-[5vw]">
      <div className="max-w-[1200px] mx-auto">
        <p className="font-mono text-xs tracking-[0.2em] text-[#484F58] uppercase mb-4">
          LEARN &amp; RIDE
        </p>
        <h2
          className="text-white font-semibold leading-tight tracking-[-0.02em] mb-10"
          style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
        >
          Tips for a Better Ride
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {articlesList?.items?.map((article) => {
            const image = articleImages[article.title] || '/product-ebike-premium.jpg'
            return (
              <div key={article.id} className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden group">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <span
                    className="inline-block text-xs font-medium px-2.5 py-1 rounded mb-2"
                    style={{
                      backgroundColor: `${categoryColors[article.category] || '#01D7D5'}18`,
                      color: categoryColors[article.category] || '#01D7D5',
                    }}
                  >
                    {article.category}
                  </span>
                  <h4 className="text-white font-medium text-base mb-2 line-clamp-2">{article.title}</h4>
                  <p className="text-[#8B949E] text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                  <Link
                    to={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-1 text-[#01D7D5] text-sm hover:underline"
                  >
                    Read More
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#8B949E] hover:text-[#01D7D5] transition-colors group"
          >
            View All Articles
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
