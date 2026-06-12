import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { Search, Clock } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface Article {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: number
  date: string
  image: string
  content?: string
}

const MOCK_ARTICLES: Article[] = [
  {
    slug: 'choosing-your-first-e-bike',
    title: 'Choosing Your First E-Bike: A Complete Guide',
    excerpt: 'Everything you need to know before buying your first electric bike in Algeria. From motor types to battery range, we cover it all.',
    category: 'Guides',
    readTime: 8,
    date: '2025-05-15',
    image: '/article-choose-ebike.jpg',
    content: 'Electric bikes are transforming how Algerians commute. With rising fuel costs and increasing environmental awareness, e-bikes offer a practical, affordable alternative. This guide covers motor types (hub vs mid-drive), battery capacities, range considerations, and local regulations. We also review the best e-bikes available in the Algerian market right now.',
  },
  {
    slug: 'battery-care-tips',
    title: 'E-Bike Battery Care: Extend Your Range',
    excerpt: 'Simple maintenance tips to double your battery lifespan and maximize range on every ride.',
    category: 'Maintenance',
    readTime: 5,
    date: '2025-05-10',
    image: '/article-maintenance.jpg',
    content: 'Your e-bike battery is the most expensive component. Proper care can extend its life from 2 years to 5+ years. Key tips: avoid extreme temperatures, charge to 80% for daily use, store at 50% charge during long periods, and never let it fully discharge.',
  },
  {
    slug: 'algeria-electric-revolution',
    title: "Algeria's Electric Mobility Revolution",
    excerpt: 'How electric bikes and scooters are changing urban transportation across Algerian cities.',
    category: 'Industry News',
    readTime: 6,
    date: '2025-04-28',
    image: '/article-industry.jpg',
    content: 'From Algiers to Oran, electric two-wheelers are becoming a common sight. Government initiatives, improving infrastructure, and growing environmental consciousness are driving adoption. We explore the trends shaping this transformation.',
  },
  {
    slug: 'referral-program-guide',
    title: 'How to Earn with Our Referral Program',
    excerpt: 'A step-by-step guide to maximizing your income through the E-Ride referral and rank system.',
    category: 'Marketing',
    readTime: 7,
    date: '2025-04-20',
    image: '/article-referral.jpg',
    content: 'Our referral program is one of the most generous in Algeria. Learn how to climb from Starter to Diamond rank, earning up to 10% commission on direct sales and team overrides. We share strategies from our top marketers.',
  },
  {
    slug: 'safety-gear-essentials',
    title: 'Safety Gear Every Rider Needs',
    excerpt: 'The essential protective equipment you should never ride without, from helmets to lights.',
    category: 'Safety',
    readTime: 4,
    date: '2025-04-12',
    image: '/article-safety.jpg',
    content: 'Safety should never be compromised. This article covers the must-have gear: certified helmets, reflective clothing, front and rear lights, gloves, and mirrors. We also discuss Algerian road safety laws for e-bikes.',
  },
  {
    slug: 'winter-riding-tips',
    title: 'Riding in Winter: Tips & Precautions',
    excerpt: 'How to safely ride your e-bike during the rainy season and colder months in Algeria.',
    category: 'Maintenance',
    readTime: 5,
    date: '2025-03-30',
    image: '/article-riding-tips.jpg',
    content: 'Winter riding requires extra preparation. Learn about tire pressure adjustments, waterproofing your electronics, proper clothing layering, and battery performance in cold weather. Stay safe and keep riding year-round.',
  },
]

const getCategories = (isAr: boolean) => isAr
  ? ['جميع الفئات', 'أدلة', 'صيانة', 'أخبار الصناعة', 'تسويق', 'سلامة']
  : ['All Categories', 'Guides', 'Maintenance', 'Industry News', 'Marketing', 'Safety']

export default function Blog() {
  const { t } = useLanguage()
  const [search, setSearch] = useState('')
  const isAr = t('nav.home') === 'الرئيسية'
  const categories = getCategories(isAr)
  const [activeCategory, setActiveCategory] = useState(isAr ? 'جميع الفئات' : 'All Categories')

  const featured = MOCK_ARTICLES[0]

  const filtered = useMemo(() => {
    const allCategoriesLabel = isAr ? 'جميع الفئات' : 'All Categories'
    return MOCK_ARTICLES.filter((a) => {
      if (activeCategory !== allCategoriesLabel && a.category !== activeCategory) return false
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.excerpt.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [activeCategory, search, isAr])

  return (
    <div className="min-h-screen bg-black pt-[70px]">
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
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <span className="inline-block bg-[rgba(1,215,213,0.1)] text-[#01D7D5] text-[10px] font-bold px-3 py-1 rounded-full mb-3 w-fit">{t('nav.home') === 'الرئيسية' ? 'مميز' : 'FEATURED'}</span>
                <span className="text-[#484F58] text-xs mb-2">{featured.category} &middot; {featured.date}</span>
                <h2 className="text-white font-semibold text-2xl mb-3 group-hover:text-[#01D7D5] transition-colors">{featured.title}</h2>
                <p className="text-[#8B949E] text-sm leading-relaxed mb-4">{featured.excerpt}</p>
                <span className="text-[#01D7D5] text-sm flex items-center gap-1">{t('articles.readMore')} &rarr;</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.slice(1).map((article) => (
            <Link key={article.slug} to={`/blog/${article.slug}`} className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden group hover:-translate-y-1 hover:border-[rgba(255,255,255,0.1)] transition-all">
              <div className="aspect-[16/10] bg-[#0A0A0A] overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5">
                <span className="text-[#484F58] text-[10px] uppercase tracking-wider">{article.category}</span>
                <h3 className="text-white font-medium text-base mt-1 mb-2 group-hover:text-[#01D7D5] transition-colors">{article.title}</h3>
                <p className="text-[#8B949E] text-xs leading-relaxed mb-3 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#484F58] text-[10px] flex items-center gap-1"><Clock size={10} /> {article.readTime} {t('blog.readTime')}</span>
                  <span className="text-[#01D7D5] text-[10px]">{t('articles.readMore')} &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
