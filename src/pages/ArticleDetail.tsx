import { useParams, Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { Share2, Clock, Calendar } from 'lucide-react'

const articleImages: Record<string, string> = {
  'How to Extend Your Battery Life': '/article-battery.jpg',
  'Best Charging Practices for E-Scooters': '/article-charging.jpg',
  'Safety Tips for Riding in Algerian Cities': '/article-safety.jpg',
  'Understanding Your E-Bike Motor': '/article-motor.jpg',
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data: article } = trpc.article.getBySlug.useQuery({ slug: slug || '' })

  if (!article) {
    return (
      <div className="min-h-screen bg-black pt-[70px] flex items-center justify-center">
        <div className="animate-shimmer w-96 h-96 rounded-xl" />
      </div>
    )
  }

  const image = articleImages[article.title] || '/product-ebike-premium.jpg'

  return (
    <div className="min-h-screen bg-black pt-[70px]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-[5vw] py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#484F58] mb-6">
          <Link to="/" className="hover:text-[#01D7D5]">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-[#01D7D5]">Blog</Link>
          <span>/</span>
          <span className="text-[#8B949E] truncate max-w-[200px]">{article.title}</span>
        </div>

        {/* Category */}
        <span className="inline-block text-xs font-medium text-[#01D7D5] bg-[rgba(1,215,213,0.15)] px-3 py-1 rounded mb-4">
          {article.category}
        </span>

        <h1 className="text-white font-semibold text-3xl md:text-4xl mb-4 leading-tight">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-[#484F58] mb-8">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-[#30363D] flex items-center justify-center text-white text-xs font-semibold">
              ER
            </div>
            <span className="text-[#8B949E]">E-Ride Team</span>
          </div>
          <span>·</span>
          <span className="flex items-center gap-1"><Calendar size={14} /> {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'N/A'}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock size={14} /> 5 min read</span>
          <button className="ml-auto text-[#484F58] hover:text-[#01D7D5] transition-colors">
            <Share2 size={16} />
          </button>
        </div>

        {/* Featured Image */}
        <div className="aspect-video rounded-xl overflow-hidden mb-10">
          <img src={image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-white leading-[1.8] text-lg">{article.content || article.excerpt}</p>
        </div>

        {/* Tags */}
        {article.tags ? (
          <div className="flex items-center gap-2 mt-10 flex-wrap">
            <span className="text-[#484F58] text-sm">Tags:</span>
            {(typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags as string[]).map((tag: string) => (
              <span key={tag} className="text-xs text-[#8B949E] bg-[#161B22] border border-[#30363D] px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
