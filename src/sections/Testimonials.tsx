import { useRef, useEffect } from 'react'

const testimonials = [
  { name: 'Ahmed Benali', rank: 'Gold', earnings: '485,000', quote: 'The referral program changed my life. I started sharing my link on social media and within 3 months I hit Gold rank. The commission system is fair and payments are always on time.' },
  { name: 'Karim Hadj', rank: 'Platinum', earnings: '1,250,000', quote: 'Building my team was the best decision I made. The 5% team bonus adds up quickly when you have motivated marketers under you. E-Ride gives us all the tools we need.' },
  { name: 'Yasmine Djebbar', rank: 'Silver', earnings: '180,000', quote: 'I joined as a side hustle and now earn more from commissions than my day job. The products practically sell themselves - everyone wants an electric scooter!' },
  { name: 'Omar Khalef', rank: 'Diamond', earnings: '2,800,000', quote: 'From Starter to Diamond in 8 months. The rank rewards are incredible - I got a free electric scooter at Platinum and a luxury trip at Diamond. Best program in Algeria.' },
  { name: 'Sofia Mansouri', rank: 'Gold', earnings: '620,000', quote: 'The dashboard makes it so easy to track everything - my sales, commissions, team performance. Customer support is responsive and the community is amazing.' },
  { name: 'Nadia Berrahal', rank: 'Silver', earnings: '240,000', quote: 'I love that I can work from anywhere. I share my referral link on WhatsApp groups and Instagram stories. The 5% commission on every sale is generous.' },
]

const rankColors: Record<string, string> = {
  Starter: '#01D7D5',
  Silver: '#C0C0C0',
  Gold: '#FFD700',
  Platinum: '#E5E4E2',
  Diamond: '#B9F2FF',
}

const marketerNames = ['Ahmed Benali', 'Karim Hadj', 'Yasmine Djebbar', 'Omar Khalef', 'Sofia Mansouri', 'Nadia Berrahal', 'Farid Taleb', 'Amel Chenouf', 'Rachid Meziane', 'Lina Bouzid']

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let pos = 0
    let raf: number
    const step = () => {
      pos += 0.3
      if (pos >= el.scrollHeight / 2) pos = 0
      el.scrollTop = pos
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="w-full bg-[#0A0A0A] py-20 px-4 sm:px-6 lg:px-[5vw] overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <p className="font-mono text-xs tracking-[0.2em] text-[#484F58] uppercase mb-4 text-center">
          SUCCESS STORIES
        </p>
        <h2
          className="text-white font-semibold leading-tight tracking-[-0.02em] mb-12 text-center"
          style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
        >
          What Our Marketers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-[#161B22] border border-[#30363D] rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#30363D] flex items-center justify-center text-white font-semibold text-sm">
                  {t.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{t.name}</p>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${rankColors[t.rank]}18`, color: rankColors[t.rank] }}
                  >
                    {t.rank}
                  </span>
                </div>
                <span className="ml-auto text-[#01D7D5] font-semibold text-sm">
                  DZD {t.earnings}
                </span>
              </div>
              <p className="text-[#8B949E] text-sm italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            </div>
          ))}
        </div>

        {/* Scrolling Names Marquee */}
        <div className="h-60 overflow-hidden relative">
          <div
            ref={scrollRef}
            className="absolute inset-0 overflow-hidden"
          >
            <div className="animate-scroll">
              {[...marketerNames, ...marketerNames].map((name, idx) => (
                <div
                  key={idx}
                  className="text-4xl md:text-5xl font-bold py-3 text-white text-center"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
