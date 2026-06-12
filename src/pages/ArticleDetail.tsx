import { Link, useParams } from 'react-router'
import { ArrowLeft, Clock, Share2, Heart } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface Article {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: number
  date: string
  image: string
  content: string
  tags: string[]
}

const MOCK_ARTICLES: Article[] = [
  {
    slug: 'choosing-your-first-e-bike',
    title: 'Choosing Your First E-Bike: A Complete Guide',
    excerpt: 'Everything you need to know before buying your first electric bike in Algeria.',
    category: 'Guides',
    readTime: 8,
    date: '2025-05-15',
    image: '/article-choose-ebike.jpg',
    content: `Electric bikes are transforming how Algerians commute. With rising fuel costs and increasing environmental awareness, e-bikes offer a practical, affordable alternative to traditional transportation.\n\n## Motor Types\n\nThe two main motor types are hub motors and mid-drive motors. Hub motors are simpler, quieter, and require less maintenance, making them ideal for city commuters. Mid-drive motors offer better weight distribution and hill-climbing performance, perfect for the varied terrain around Algerian cities.\n\n## Battery Range\n\nMost e-bikes offer between 40-100km of range on a single charge. For daily commuting in Algiers or Oran, a 60km range is typically sufficient. Consider your daily distance and whether you'll have access to charging at work.\n\n## Legal Requirements\n\nIn Algeria, e-bikes with motors under 250W and top speeds of 25km/h are classified as bicycles and don't require registration. Higher-powered models may require a license plate and insurance.\n\n## Our Recommendations\n\nFor city commuters: The E-Ride City Pro offers excellent value with its 80km range and comfortable riding position. For adventure seekers: The E-Ride Mountain X handles both city streets and mountain trails with ease.`,
    tags: ['E-Bikes', 'Buying Guide', 'Algeria'],
  },
  {
    slug: 'battery-care-tips',
    title: 'E-Bike Battery Care: Extend Your Range',
    excerpt: 'Simple maintenance tips to double your battery lifespan.',
    category: 'Maintenance',
    readTime: 5,
    date: '2025-05-10',
    image: '/article-maintenance.jpg',
    content: `Your e-bike battery is the most expensive component, typically costing 30-40% of the total bike price. Proper care can extend its life from 2 years to 5+ years.\n\n## Charging Best Practices\n\n- Charge to 80% for daily use; only charge to 100% before long rides\n- Avoid letting the battery drop below 20%\n- Use the original charger\n- Charge at room temperature when possible\n\n## Storage Tips\n\n- Store at 50% charge during long periods of non-use\n- Keep in a cool, dry place away from direct sunlight\n- Remove the battery if storing the bike outdoors\n\n## Temperature Considerations\n\nAlgerian summers can be harsh on batteries. Avoid leaving your e-bike in direct sunlight for extended periods. In extreme heat (above 40°C), battery performance may temporarily decrease.`,
    tags: ['Battery', 'Maintenance', 'Tips'],
  },
  {
    slug: 'algeria-electric-revolution',
    title: "Algeria's Electric Mobility Revolution",
    excerpt: 'How electric bikes and scooters are changing urban transportation.',
    category: 'Industry News',
    readTime: 6,
    date: '2025-04-28',
    image: '/article-industry.jpg',
    content: `From Algiers to Oran, electric two-wheelers are becoming an increasingly common sight on Algerian streets. This shift is driven by multiple factors converging at the right time.\n\n## Economic Factors\n\nWith fuel prices fluctuating and the cost of car ownership rising, many Algerians are looking for affordable alternatives. An e-bike costs as little as 2 DZD per 10km to operate, compared to 150+ DZD for a car.\n\n## Environmental Awareness\n\nYoung Algerians are increasingly conscious of environmental issues. Electric mobility produces zero direct emissions and significantly reduces noise pollution in crowded urban areas.\n\n## Government Support\n\nRecent initiatives promoting clean transportation have created a favorable environment for e-mobility adoption. Infrastructure improvements, including dedicated bike lanes in major cities, are making cycling safer and more convenient.`,
    tags: ['Industry', 'Algeria', 'Trends'],
  },
  {
    slug: 'referral-program-guide',
    title: 'How to Earn with Our Referral Program',
    excerpt: 'A step-by-step guide to maximizing your income through the E-Ride referral system.',
    category: 'Marketing',
    readTime: 7,
    date: '2025-04-20',
    image: '/article-referral.jpg',
    content: `The E-Ride referral program is one of the most generous in Algeria, offering marketers the opportunity to build substantial income through direct sales and team commissions.\n\n## Getting Started\n\nSign up as a marketer, receive your unique referral link, and start sharing it with your network. Every sale made through your link earns you a commission.\n\n## The Rank System\n\n climb through five ranks: Starter, Silver, Gold, Platinum, and Diamond. Each rank unlocks higher commission rates and bonus opportunities. Most active marketers reach Gold within their first 3 months.\n\n## Team Building\n\nThe real power comes from building a team. When you recruit other marketers, you earn overrides on their sales too. Top Diamond marketers manage teams of 50+ people.`,
    tags: ['Referral', 'Income', 'Marketing'],
  },
  {
    slug: 'safety-gear-essentials',
    title: 'Safety Gear Every Rider Needs',
    excerpt: 'The essential protective equipment you should never ride without.',
    category: 'Safety',
    readTime: 4,
    date: '2025-04-12',
    image: '/article-safety.jpg',
    content: `Safety should never be compromised when riding an e-bike or e-scooter. Here's the essential gear every rider should invest in.\n\n## Helmet (Mandatory)\n\nA certified helmet is the single most important piece of safety equipment. Look for CE or CPSC certification. Our E-Ride Air Helmet offers excellent ventilation and includes an integrated LED light for night riding.\n\n## Lights and Reflectors\n\nFront white light and rear red light are essential for night riding. Reflective clothing increases visibility during dawn and dusk when most accidents occur.\n\n## Gloves and Eye Protection\n\nGloves protect your hands in case of falls and improve grip. Sunglasses or clear glasses shield your eyes from dust, insects, and wind.`,
    tags: ['Safety', 'Gear', 'Essentials'],
  },
  {
    slug: 'winter-riding-tips',
    title: 'Riding in Winter: Tips & Precautions',
    excerpt: 'How to safely ride during the rainy season and colder months.',
    category: 'Maintenance',
    readTime: 5,
    date: '2025-03-30',
    image: '/article-riding-tips.jpg',
    content: `Algerian winters are mild compared to Europe, but rain and cooler temperatures still require preparation. Here's how to ride safely during the colder months.\n\n## Tire Care\n\nWet roads reduce traction. Lower your tire pressure slightly for better grip. Consider tires with deeper tread patterns if you ride frequently in wet conditions.\n\n## Battery Performance\n\nCold weather reduces battery capacity. Store your battery indoors when not in use, and allow it to warm up before charging. Range can drop by 15-20% in cold conditions.\n\n## Clothing\n\nLayer your clothing for temperature regulation. A waterproof outer layer is essential. Don't forget waterproof gloves and shoe covers.`,
    tags: ['Winter', 'Maintenance', 'Safety'],
  },
]

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useLanguage()

  const article = MOCK_ARTICLES.find((a) => a.slug === slug)

  if (!article) {
    return (
      <div className="min-h-screen bg-black pt-[70px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">{t('nav.home') === 'الرئيسية' ? 'المقال غير موجود' : 'Article not found'}</p>
          <Link to="/blog" className="text-[#01D7D5] hover:underline">{t('nav.home') === 'الرئيسية' ? 'العودة للمدونة' : 'Back to Blog'}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-[70px]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-[5vw] py-12">
        <Link to="/blog" className="inline-flex items-center gap-1 text-[#8B949E] text-sm mb-8 hover:text-[#01D7D5] transition-colors">
          <ArrowLeft size={16} /> {t('nav.home') === 'الرئيسية' ? 'العودة للمدونة' : 'Back to Blog'}
        </Link>

        <div className="aspect-[21/9] rounded-xl overflow-hidden mb-8 bg-[#161B22] border border-[#30363D]">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <span className="text-[#484F58] text-xs uppercase tracking-wider">{article.category}</span>
        <h1 className="text-white font-semibold text-3xl md:text-4xl mt-2 mb-4">{article.title}</h1>

        <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#30363D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#30363D] flex items-center justify-center text-xs font-medium text-white">ER</div>
            <div>
              <p className="text-white text-sm">E-Ride Team</p>
              <p className="text-[#484F58] text-xs">{article.date} · {article.readTime} {t('blog.readTime')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-[#484F58] hover:text-[#EF4444] transition-colors"><Heart size={18} /></button>
            <button className="p-2 text-[#484F58] hover:text-[#01D7D5] transition-colors"><Share2 size={18} /></button>
          </div>
        </div>

        <div className="prose prose-invert max-w-none mb-10">
          <p className="text-[#8B949E] text-lg leading-relaxed mb-6">{article.excerpt}</p>
          <div className="text-[#E6EDF3] leading-relaxed whitespace-pre-line">{article.content}</div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {article.tags.map((tag) => (
            <span key={tag} className="bg-[#161B22] border border-[#30363D] text-[#8B949E] text-xs px-3 py-1 rounded-full">{tag}</span>
          ))}
        </div>

        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
          <h3 className="text-white font-medium mb-2">{t('nav.home') === 'الرئيسية' ? 'مقالات ذات صلة' : 'Related Articles'}</h3>
          <div className="space-y-3">
            {MOCK_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3).map((a) => (
              <Link key={a.slug} to={`/blog/${a.slug}`} className="flex items-center gap-3 group">
                <div className="w-16 h-10 rounded-lg bg-[#0A0A0A] border border-[#30363D] overflow-hidden shrink-0">
                  <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-white text-sm group-hover:text-[#01D7D5] transition-colors">{a.title}</p>
                  <p className="text-[#484F58] text-[10px] flex items-center gap-1"><Clock size={8} /> {a.readTime} {t('blog.readTime')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
