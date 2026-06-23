import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { trpc } from '@/providers/trpc'

const categoryColors: Record<string, string> = {
  'Guides': '#01D7D5',
  'Maintenance': '#F59E0B',
  'Industry News': '#3B82F6',
  'Technology': '#8B5CF6',
  'Safety': '#EF4444',
}

// Fallback articles when API is unavailable
const FALLBACK_ARTICLES = [
  { id: 1, slug: 'choosing-your-first-e-bike', title: 'Choosing Your First E-Bike: A Complete Guide', excerpt: 'Everything you need to know before buying your first electric bike. From motor types to battery range, we cover it all.', category: 'Guides', readTime: 8, featuredImage: '/article-guide.jpg' },
  { id: 2, slug: 'battery-care-tips', title: 'E-Bike Battery Care: Extend Your Range', excerpt: 'Simple maintenance tips to double your battery lifespan and maximize range on every ride.', category: 'Maintenance', readTime: 5, featuredImage: '/article-battery.jpg' },
  { id: 3, slug: 'electric-mobility-revolution', title: "Electric Mobility Revolution", excerpt: 'How electric bikes and scooters are changing urban transportation across cities around the world.', category: 'Industry News', readTime: 6, featuredImage: '/article-industry.jpg' },
  { id: 4, slug: 'understanding-your-motor', title: 'Understanding Your E-Bike Motor', excerpt: 'A deep dive into how electric bike motors work and what to look for when choosing one.', category: 'Technology', readTime: 7, featuredImage: '/article-motor.jpg' },
]

export default function EducationalPreview() {
  const { t, lang } = useLanguage()

  // Fetch from API with fallback
  const { data: articlesData, isLoading } = trpc.article.list.useQuery({ limit: 4 }, { staleTime: 60_000 })
  const articles = (articlesData?.items && articlesData.items.length > 0) ? articlesData.items : FALLBACK_ARTICLES

  return (
    <section className="w-full bg-[#0A0A0A] py-20 px-4 sm:px-6 lg:px-[5vw]">
      <div className="max-w-[1200px] mx-auto">
        <p className="font-mono text-xs tracking-[0.2em] text-[#484F58] uppercase mb-4">
          {t('edu.badge')}
        </p>
        <h2
          className="text-white font-semibold leading-tight tracking-[-0.02em] mb-10"
          style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
        >
          {t('articles.subtitle')}
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {FALLBACK_ARTICLES.map((a) => (
              <div key={a.id} className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-[#0A0A0A]" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-[#30363D] rounded w-1/3" />
                  <div className="h-4 bg-[#30363D] rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {articles.slice(0, 4).map((article: any) => (
                <div key={article.id} className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden group">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.featuredImage || '/article-industry.jpg'}
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
                      {t('articles.readMore')}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-[#8B949E] hover:text-[#01D7D5] transition-colors group"
              >
                {t('articles.viewAll')}
                <span className="group-hover:translate-x-1 transition-transform">{lang === 'ar' ? '←' : '→'}</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
