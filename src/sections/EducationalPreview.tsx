import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { MOCK_ARTICLES } from '@/pages/Blog'

const categoryColors: Record<string, string> = {
  'Guides': '#01D7D5',
  'Maintenance': '#F59E0B',
  'Industry News': '#3B82F6',
  'Technology': '#8B5CF6',
  'Safety': '#EF4444',
}

export default function EducationalPreview() {
  const { t, lang } = useLanguage()

  // Show first 4 articles from the shared data
  const articles = MOCK_ARTICLES.slice(0, 4)

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {articles.map((article) => (
            <div key={article.slug} className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden group">
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.image}
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
      </div>
    </section>
  )
}
