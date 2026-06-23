import { Link, useParams } from 'react-router'
import { ArrowLeft, Clock, Share2, Heart } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { trpc } from '@/providers/trpc'

const FALLBACK_ARTICLES = [
  { id: 1, slug: 'choosing-your-first-e-bike', title: 'Choosing Your First E-Bike: A Complete Guide', excerpt: 'Everything you need to know before buying your first electric bike. From motor types to battery range, we cover it all.', category: 'Guides', readTime: 8, date: '2025-05-15', publishedAt: '2025-05-15', featuredImage: '/article-guide.jpg', content: 'Electric bikes are transforming how people commute. With so many options on the market, choosing your first e-bike can feel overwhelming. This guide walks you through the key factors: motor power (250W for casual riding, 500W+ for hills), battery capacity (measured in watt-hours), frame style (step-through vs. diamond), and budget considerations. We also cover local regulations and test ride tips to ensure you make the right choice.' },
  { id: 2, slug: 'battery-care-tips', title: 'E-Bike Battery Care: Extend Your Range', excerpt: 'Simple maintenance tips to double your battery lifespan and maximize range on every ride.', category: 'Maintenance', readTime: 5, date: '2025-05-10', publishedAt: '2025-05-10', featuredImage: '/article-battery.jpg', content: 'Your e-bike battery is the most expensive component and deserves proper care. Always store your battery at room temperature, avoid extreme heat or cold. Charge it regularly and avoid letting it drain completely below 20%. Use the manufacturer charger only. Clean the contacts monthly with a dry cloth. Following these simple tips can extend your battery life by 2-3 years and maintain optimal range.' },
  { id: 3, slug: 'electric-mobility-revolution', title: 'Electric Mobility Revolution', excerpt: 'How electric bikes and scooters are changing urban transportation across cities around the world.', category: 'Industry News', readTime: 6, date: '2025-04-28', publishedAt: '2025-04-28', featuredImage: '/article-industry.jpg', content: 'From cities worldwide, electric two-wheelers are becoming the preferred mode of urban transport. With zero emissions, low operating costs, and the ability to bypass traffic, e-bikes and e-scooters offer a compelling alternative to cars and public transit. Governments are investing in charging infrastructure and bike lanes, while companies are innovating with swappable batteries and smart connectivity. The future of urban mobility is electric.' },
  { id: 4, slug: 'understanding-your-motor', title: 'Understanding Your E-Bike Motor', excerpt: 'A deep dive into how electric bike motors work and what to look for when choosing one.', category: 'Technology', readTime: 7, date: '2025-04-20', publishedAt: '2025-04-20', featuredImage: '/article-motor.jpg', content: 'The motor is the heart of your e-bike. There are three main types: hub motors (in the wheel, quiet and low maintenance), mid-drive motors (near the pedals, better balance and hill climbing), and friction drive motors (less common). Power ratings range from 250W to 750W+. Torque, measured in Newton-meters (Nm), determines how well your bike climbs hills. A good e-bike motor should deliver smooth, natural assistance that feels like an extension of your own pedaling.' },
  { id: 5, slug: 'safety-gear-essentials', title: 'Safety Gear Every Rider Needs', excerpt: 'The essential protective equipment you should never ride without, from helmets to lights.', category: 'Safety', readTime: 4, date: '2025-04-12', publishedAt: '2025-04-12', featuredImage: '/article-safety.jpg', content: 'Safety should never be compromised when riding an electric vehicle. The absolute must-haves are: a certified helmet (CE or CPSC), front and rear lights for visibility, reflective clothing for night riding, gloves for grip and protection, and a bell or horn to alert pedestrians. Consider adding knee and elbow pads for higher-speed scooters. Remember, being visible and predictable is just as important as protective gear.' },
  { id: 6, slug: 'charging-best-practices', title: 'Best Charging Practices for E-Scooters', excerpt: 'How to properly charge your electric scooter for maximum battery life and performance.', category: 'Maintenance', readTime: 5, date: '2025-03-30', publishedAt: '2025-03-30', featuredImage: '/article-charging.jpg', content: 'Proper charging habits are the key to a long-lasting e-scooter battery. Always charge after every ride, even if the battery is not fully depleted. Avoid overcharging by unplugging once full (within 1-2 hours). Charge in a dry, ventilated area away from flammable materials. Never charge a wet scooter. If storing for extended periods, keep the battery at 50-70% charge. These habits will maximize both battery life and daily range.' },
]

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { t, lang } = useLanguage()

  // Fetch article from API (fallback on static deployment)
  const { data: apiArticle, isLoading } = trpc.article.getBySlug.useQuery(
    { slug: slug || '' },
    { enabled: !!slug, staleTime: 60_000 }
  )
  const article = apiArticle || FALLBACK_ARTICLES.find((a) => a.slug === slug) || null

  // Fetch related articles
  const { data: apiAllArticles } = trpc.article.list.useQuery({ limit: 10 }, { staleTime: 60_000 })
  const allArticles = apiAllArticles?.items?.length ? apiAllArticles.items : FALLBACK_ARTICLES
  const related = allArticles.filter((a: any) => a.slug !== slug).slice(0, 3)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-[90px] flex items-center justify-center">
        <p className="text-[#484F58]">Loading article...</p>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black pt-[90px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">{lang === 'ar' ? 'المقال غير موجود' : lang === 'fr' ? 'Article non trouvé' : 'Article not found'}</p>
          <Link to="/blog" className="text-[#01D7D5] hover:underline">{lang === 'ar' ? 'العودة للمدونة' : lang === 'fr' ? 'Retour au Blog' : 'Back to Blog'}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-[90px]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-[5vw] py-12">
        <Link to="/blog" className="inline-flex items-center gap-1 text-[#8B949E] text-sm mb-8 hover:text-[#01D7D5] transition-colors">
          <ArrowLeft size={16} /> {lang === 'ar' ? 'العودة للمدونة' : lang === 'fr' ? 'Retour au Blog' : 'Back to Blog'}
        </Link>

        <div className="aspect-[21/9] rounded-xl overflow-hidden mb-8 bg-[#161B22] border border-[#30363D]">
          <img src={article.featuredImage || '/article-industry.jpg'} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <span className="text-[#484F58] text-xs uppercase tracking-wider">{article.category}</span>
        <h1 className="text-white font-semibold text-3xl md:text-4xl mt-2 mb-4">{article.title}</h1>

        <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#30363D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#30363D] flex items-center justify-center text-xs font-medium text-white">NX</div>
            <div>
              <p className="text-white text-sm">Nexivora Team</p>
              <p className="text-[#484F58] text-xs">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''} &middot; {article.readTime || 5} {t('blog.readTime')}</p>
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

        {article.tags && (
          <div className="flex flex-wrap gap-2 mb-10">
            {(typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags).map((tag: string) => (
              <span key={tag} className="bg-[#161B22] border border-[#30363D] text-[#8B949E] text-xs px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        )}

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
            <h3 className="text-white font-medium mb-2">{lang === 'ar' ? 'مقالات ذات صلة' : lang === 'fr' ? 'Articles Similaires' : 'Related Articles'}</h3>
            <div className="space-y-3">
              {related.map((a: any) => (
                <Link key={a.id} to={`/blog/${a.slug}`} className="flex items-center gap-3 group">
                  <div className="w-16 h-10 rounded-lg bg-[#0A0A0A] border border-[#30363D] overflow-hidden shrink-0">
                    <img src={a.featuredImage || '/article-industry.jpg'} alt={a.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-white text-sm group-hover:text-[#01D7D5] transition-colors">{a.title}</p>
                    <p className="text-[#484F58] text-[10px] flex items-center gap-1"><Clock size={8} /> {a.readTime || 5} {t('blog.readTime')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
