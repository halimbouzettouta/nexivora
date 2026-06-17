import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { Search, Clock } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export interface Article {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: number
  date: string
  image: string
  content?: string
  tags: string[]
}

export const MOCK_ARTICLES: Article[] = [
  {
    slug: 'choosing-your-first-e-bike',
    title: 'Choosing Your First E-Bike: A Complete Guide',
    excerpt: 'Everything you need to know before buying your first electric bike in Algeria. From motor types to battery range, we cover it all.',
    category: 'Guides',
    readTime: 8,
    date: '2025-05-15',
    image: '/article-guide.jpg',
    content: `Electric bikes are transforming how Algerians commute. With rising fuel costs and increasing environmental awareness, e-bikes offer a practical, affordable alternative to traditional transportation.\n\n## Motor Types\n\nThe two main motor types are hub motors and mid-drive motors. Hub motors are simpler, quieter, and require less maintenance, making them ideal for city commuters. Mid-drive motors offer better weight distribution and hill-climbing performance, perfect for the varied terrain around Algerian cities.\n\n## Battery Range\n\nMost e-bikes offer between 40-100km of range on a single charge. For daily commuting in Algiers or Oran, a 60km range is typically sufficient. Consider your daily distance and whether you'll have access to charging at work.\n\n## Legal Requirements\n\nIn Algeria, e-bikes with motors under 250W and top speeds of 25km/h are classified as bicycles and don't require registration. Higher-powered models may require a license plate and insurance.\n\n## Our Recommendations\n\nFor city commuters: The Nexivora City Pro offers excellent value with its 80km range and comfortable riding position. For adventure seekers: The Nexivora Mountain X handles both city streets and mountain trails with ease.`,
    tags: ['E-Bikes', 'Buying Guide', 'Algeria'],
  },
  {
    slug: 'battery-care-tips',
    title: 'E-Bike Battery Care: Extend Your Range',
    excerpt: 'Simple maintenance tips to double your battery lifespan and maximize range on every ride.',
    category: 'Maintenance',
    readTime: 5,
    date: '2025-05-10',
    image: '/article-battery.jpg',
    content: `Your e-bike battery is the most expensive component, typically costing 30-40% of the total bike price. Proper care can extend its life from 2 years to 5+ years.\n\n## Charging Best Practices\n\n- Charge to 80% for daily use; only charge to 100% before long rides\n- Avoid letting the battery drop below 20%\n- Use the original charger\n- Charge at room temperature when possible\n\n## Storage Tips\n\n- Store at 50% charge during long periods of non-use\n- Keep in a cool, dry place away from direct sunlight\n- Remove the battery if storing the bike outdoors\n\n## Temperature Considerations\n\nAlgerian summers can be harsh on batteries. Avoid leaving your e-bike in direct sunlight for extended periods. In extreme heat (above 40°C), battery performance may temporarily decrease.`,
    tags: ['Battery', 'Maintenance', 'Tips'],
  },
  {
    slug: 'algeria-electric-revolution',
    title: "Algeria's Electric Mobility Revolution",
    excerpt: 'How electric bikes and scooters are changing urban transportation across Algerian cities.',
    category: 'Industry News',
    readTime: 6,
    date: '2025-04-28',
    image: '/article-industry.jpg',
    content: `From Algiers to Oran, electric two-wheelers are becoming an increasingly common sight on Algerian streets. This shift is driven by multiple factors converging at the right time.\n\n## Economic Factors\n\nWith fuel prices fluctuating and the cost of car ownership rising, many Algerians are looking for affordable alternatives. An e-bike costs as little as 2 DZD per 10km to operate, compared to 150+ DZD for a car.\n\n## Environmental Awareness\n\nYoung Algerians are increasingly conscious of environmental issues. Electric mobility produces zero direct emissions and significantly reduces noise pollution in crowded urban areas.\n\n## Government Support\n\nRecent initiatives promoting clean transportation have created a favorable environment for e-mobility adoption. Infrastructure improvements, including dedicated bike lanes in major cities, are making cycling safer and more convenient.`,
    tags: ['Industry', 'Algeria', 'Trends'],
  },
  {
    slug: 'understanding-your-motor',
    title: 'Understanding Your E-Bike Motor',
    excerpt: 'A deep dive into how electric bike motors work and what to look for when choosing one.',
    category: 'Technology',
    readTime: 7,
    date: '2025-04-20',
    image: '/article-motor.jpg',
    content: `The motor is the heart of your e-bike, and understanding how it works can help you make better purchasing decisions and get the most out of your ride.\n\n## Hub Motors vs Mid-Drive\n\nHub motors are located in the wheel hub (front or rear). They're quieter, simpler, and require virtually no maintenance. Rear hub motors offer better traction, especially on hills.\n\nMid-drive motors are positioned at the crank. They provide better weight distribution, more natural pedaling feel, and superior hill-climbing thanks to leveraging your bike's gears.\n\n## Power Ratings\n\nMotor power is measured in watts. 250W is standard for city commuting, 500W handles hills with ease, and 750W+ is for off-road and heavy loads. Remember: in Algeria, 250W motors are classified as bicycles with no registration required.\n\n## Torque and Acceleration\n\nTorque (measured in Nm) determines how quickly you accelerate and how well you climb hills. 40-50 Nm is good for flat cities, while 60-80 Nm handles steep terrain with ease.`,
    tags: ['Motor', 'Technology', 'Guide'],
  },
  {
    slug: 'safety-gear-essentials',
    title: 'Safety Gear Every Rider Needs',
    excerpt: 'The essential protective equipment you should never ride without, from helmets to lights.',
    category: 'Safety',
    readTime: 4,
    date: '2025-04-12',
    image: '/article-safety.jpg',
    content: `Safety should never be compromised when riding an e-bike or e-scooter. Here's the essential gear every rider should invest in.\n\n## Helmet (Mandatory)\n\nA certified helmet is the single most important piece of safety equipment. Look for CE or CPSC certification. Our Nexivora Air Helmet offers excellent ventilation and includes an integrated LED light for night riding.\n\n## Lights and Reflectors\n\nFront white light and rear red light are essential for night riding. Reflective clothing increases visibility during dawn and dusk when most accidents occur.\n\n## Gloves and Eye Protection\n\nGloves protect your hands in case of falls and improve grip. Sunglasses or clear glasses shield your eyes from dust, insects, and wind.`,
    tags: ['Safety', 'Gear', 'Essentials'],
  },
  {
    slug: 'charging-best-practices',
    title: 'Best Charging Practices for E-Scooters',
    excerpt: 'How to properly charge your electric scooter for maximum battery life and performance.',
    category: 'Maintenance',
    readTime: 5,
    date: '2025-03-30',
    image: '/article-charging.jpg',
    content: `Proper charging habits are the key to a long-lasting battery and consistent performance from your electric scooter.\n\n## Daily Charging Routine\n\nCharge your scooter after every ride if the battery is below 50%. Avoid leaving it plugged in for extended periods after reaching 100%. Unplug within 30 minutes of full charge.\n\n## Environment Matters\n\nAlways charge indoors at room temperature. Charging in extreme heat or cold damages the battery cells permanently. In Algerian summers, charge during cooler evening hours when possible.\n\n## Long-Term Storage\n\nIf storing your scooter for more than 2 weeks, charge the battery to exactly 50%. Store in a cool, dry place. Check the charge level monthly and top up to 50% if needed.\n\n## Travel Tips\n\nUse a surge protector when charging in public places. Carry your charger with you for longer rides. Some cafes and co-working spaces in Algiers now offer free charging stations for e-vehicles.`,
    tags: ['Charging', 'Battery', 'Tips'],
  },
]

const getCategories = (isAr: boolean, isFr: boolean) =>
  isAr ? ['جميع الفئات', 'أدلة', 'صيانة', 'أخبار الصناعة', 'تقنية', 'سلامة']
  : isFr ? ['Toutes les Catégories', 'Guides', 'Entretien', 'Actualités', 'Technologie', 'Sécurité']
  : ['All Categories', 'Guides', 'Maintenance', 'Industry News', 'Technology', 'Safety']

export default function Blog() {
  const { t, lang } = useLanguage()
  const [search, setSearch] = useState('')
  const isAr = lang === 'ar'
  const categories = getCategories(isAr, lang === 'fr')
  const [activeCategory, setActiveCategory] = useState(isAr ? 'جميع الفئات' : lang === 'fr' ? 'Toutes les Catégories' : 'All Categories')

  const featured = MOCK_ARTICLES[0]

  const filtered = useMemo(() => {
    const allCategoriesLabel = isAr ? 'جميع الفئات' : lang === 'fr' ? 'Toutes les Catégories' : 'All Categories'
    return MOCK_ARTICLES.filter((a) => {
      if (activeCategory !== allCategoriesLabel && a.category !== activeCategory) return false
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.excerpt.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [activeCategory, search, isAr, lang])

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
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <span className="inline-block bg-[rgba(1,215,213,0.1)] text-[#01D7D5] text-[10px] font-bold px-3 py-1 rounded-full mb-3 w-fit">{lang === 'ar' ? 'مميز' : lang === 'fr' ? 'EN VEDETTE' : 'FEATURED'}</span>
                <span className="text-[#484F58] text-xs mb-2">{featured.category} &middot; {featured.date}</span>
                <h2 className="text-white font-semibold text-2xl mb-3 group-hover:text-[#01D7D5] transition-colors">{featured.title}</h2>
                <p className="text-[#8B949E] text-sm leading-relaxed mb-4">{featured.excerpt}</p>
                <span className="text-[#01D7D5] text-sm flex items-center gap-1">{t('articles.readMore')} {lang === 'fr' ? '→' : '→'}</span>
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
                  <span className="text-[#01D7D5] text-[10px]">{t('articles.readMore')} {lang === 'fr' ? '→' : '→'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
