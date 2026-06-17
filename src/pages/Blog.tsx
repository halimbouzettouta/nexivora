import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { Search, Clock } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { trpc } from '@/providers/trpc'

const getCategories = (isAr: boolean, isFr: boolean) =>
  isAr ? ['جميع الفئات', 'Guides', 'Maintenance', 'Industry News', 'Technology', 'Safety']
  : isFr ? ['Toutes les Catégories', 'Guides', 'Entretien', 'Actualités', 'Technologie', 'Sécurité']
  : ['All Categories', 'Guides', 'Maintenance', 'Industry News', 'Technology', 'Safety']

export default function Blog() {
  const { t, lang } = useLanguage()
  const [search, setSearch] = useState('')
  const isAr = lang === 'ar'
  const categories = getCategories(isAr, lang === 'fr')
  const [activeCategory, setActiveCategory] = useState(isAr ? 'جميع الفئات' : lang === 'fr' ? 'Toutes les Catégories' : 'All Categories')

  // Fetch articles from REAL API
  const { data: articles = [], isLoading } = trpc.article.list.useQuery(undefined, { staleTime: 60_000 })

  const allCategoriesLabel = isAr ? 'جميع الفئات' : lang === 'fr' ? 'Toutes les Catégories' : 'All Categories'

  const filtered = useMemo(() => {
    return articles.filter((a: any) => {
      if (activeCategory !== allCategoriesLabel && a.category !== activeCategory) return false
      if (search && !a.title?.toLowerCase().includes(search.toLowerCase()) && !a.excerpt?.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [activeCategory, search, articles, allCategoriesLabel])

  const featured = filtered[0]

  return (
    <div className="min-h-screen bg-black pt-[90px]">
      <div className="bg-black text-center pt-32 pb-20 px-4">
        <div className="flex items-center justify-center gap-2 text-sm text-[#484F58] mb-4">
          <Link to="/" className="hover:text-[#01D7D5]">{t('nav.home')}</Link><span>/</span><span className="text-[#8B949E]">{t('nav.blog')}</span>
        </div>
        <h1 className="text-white font-semibold text-4xl md:text-5xl mb-6">{t('blog.subtitle')}</h1>
        <div className="max-w-[600px] mx-auto relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#484F58]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('blog.search')}
            className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-xl pl-11 pr-4 py-3.5 focus:border-[#01D7D5] focus:outline-none" />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-[5vw] pb-20">
        {/* Featured */}
        {featured && (
          <Link to={`/blog/${featured.slug}`} className="block mb-12 group">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden hover:border-[rgba(255,255,255,0.1)] transition-all">
              <div className="aspect-[16/10] bg-[#0A0A0A] overflow-hidden">
                <img src={featured.featuredImage || '/article-industry.jpg'} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <span className="inline-block bg-[rgba(1,215,213,0.1)] text-[#01D7D5] text-[10px] font-bold px-3 py-1 rounded-full mb-3 w-fit">{lang === 'ar' ? 'مميز' : lang === 'fr' ? 'EN VEDETTE' : 'FEATURED'}</span>
                <span className="text-[#484F58] text-xs mb-2">{featured.category} &middot; {featured.publishedAt ? new Date(featured.publishedAt).toLocaleDateString() : ''}</span>
                <h2 className="text-white font-semibold text-2xl mb-3 group-hover:text-[#01D7D5] transition-colors">{featured.title}</h2>
                <p className="text-[#8B949E] text-sm leading-relaxed mb-4">{featured.excerpt}</p>
                <span className="text-[#01D7D5] text-sm flex items-center gap-1">{t('articles.readMore')} →</span>
              </div>
            </div>
          </Link>
        )}

        {/* Category filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setActiveCategory(c)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${activeCategory === c ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]' : 'text-[#484F58] hover:text-white'}`}>{c}</button>
          ))}
        </div>

        {/* Articles grid */}
        {isLoading ? (
          <div className="text-center py-12"><p className="text-[#484F58]">Loading articles...</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(1).map((article: any) => (
              <Link key={article.id} to={`/blog/${article.slug}`} className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden group hover:-translate-y-1 hover:border-[rgba(255,255,255,0.1)] transition-all">
                <div className="aspect-[16/10] bg-[#0A0A0A] overflow-hidden">
                  <img src={article.featuredImage || '/article-industry.jpg'} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-5">
                  <span className="text-[#484F58] text-[10px] uppercase tracking-wider">{article.category}</span>
                  <h3 className="text-white font-medium text-base mt-1 mb-2 group-hover:text-[#01D7D5] transition-colors">{article.title}</h3>
                  <p className="text-[#8B949E] text-xs leading-relaxed mb-3 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#484F58] text-[10px] flex items-center gap-1"><Clock size={10} /> {article.readTime || 5} {t('blog.readTime')}</span>
                    <span className="text-[#01D7D5] text-[10px]">{t('articles.readMore')} →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
