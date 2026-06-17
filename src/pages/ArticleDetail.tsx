import { Link, useParams } from 'react-router'
import { ArrowLeft, Clock, Share2, Heart } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { trpc } from '@/providers/trpc'

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { t, lang } = useLanguage()

  // Fetch article from REAL API
  const { data: article, isLoading } = trpc.article.getBySlug.useQuery(
    { slug: slug || '' },
    { enabled: !!slug, staleTime: 60_000 }
  )

  // Fetch related articles
  const { data: allArticles = [] } = trpc.article.list.useQuery({ limit: 10 }, { staleTime: 60_000 })
  const related = allArticles?.items?.filter((a: any) => a.slug !== slug).slice(0, 3) || []

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
