import { Zap, Leaf, Users, Shield } from 'lucide-react'

const stats = [
  { value: '2,500+', label: 'Happy Customers' },
  { value: '150+', label: 'Marketers' },
  { value: '12', label: 'Dealer Locations' },
]

const values = [
  { icon: <Zap size={32} />, title: 'Innovation', desc: 'Pioneering electric mobility solutions for the Algerian market.' },
  { icon: <Leaf size={32} />, title: 'Sustainability', desc: 'Committed to reducing carbon emissions through clean transportation.' },
  { icon: <Users size={32} />, title: 'Community', desc: 'Building a network of riders, marketers, and partners across Algeria.' },
  { icon: <Shield size={32} />, title: 'Integrity', desc: 'Transparent pricing, honest marketing, and reliable products.' },
]

const team = [
  { name: 'Amine Khelifi', role: 'Founder & CEO', initials: 'AK' },
  { name: 'Sarah Benmoussa', role: 'Head of Marketing', initials: 'SB' },
  { name: 'Karim Hadj', role: 'Operations Manager', initials: 'KH' },
  { name: 'Lina Merabet', role: 'Customer Success', initials: 'LM' },
]

export default function About() {
  return (
    <div className="min-h-screen bg-black pt-[70px]">
      {/* Hero */}
      <div className="bg-black text-center pt-32 pb-20 px-4">
        <h1 className="text-white font-semibold mb-4" style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
          About E-Ride Algeria
        </h1>
        <p className="text-[#8B949E] max-w-[640px] mx-auto" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
          Leading the electric mobility revolution in Algeria, one ride at a time.
        </p>
      </div>

      {/* Our Story */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-[5vw] py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#161B22] border border-[#30363D]">
              <img src="/about-warehouse.jpg" alt="E-Ride Warehouse" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-[#161B22] border border-[#30363D]">
              <img src="/escooter-lifestyle.jpg" alt="E-Ride Lifestyle" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
          <div>
            <h2 className="text-white font-semibold text-3xl mb-6">Our Story</h2>
            <div className="space-y-4 text-[#8B949E] leading-relaxed">
              <p>Founded in 2023, E-Ride Algeria was born from a simple observation: Algerians deserve better, cleaner transportation options. With rising fuel costs and increasing environmental awareness, the time for electric mobility has arrived.</p>
              <p>We started with a small showroom in Algiers and a vision to transform how Algerians move. Today, we operate 12 dealer locations across the country, with a network of over 150 marketers helping spread the word.</p>
              <p>Our commitment to quality means every product we sell undergoes rigorous testing for Algerian road conditions. We don&apos;t just sell electric vehicles - we provide a complete mobility solution with maintenance, warranty, and ongoing support.</p>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-8">
              {stats.map((s) => (
                <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 text-center">
                  <p className="text-[#01D7D5] font-semibold text-xl">{s.value}</p>
                  <p className="text-[#8B949E] text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-[#0A0A0A] py-20 px-4 sm:px-6 lg:px-[5vw]">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-white font-semibold text-3xl mb-12">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 text-center">
                <div className="text-[#01D7D5] mb-4 flex justify-center">{v.icon}</div>
                <h4 className="text-white font-medium text-lg mb-2">{v.title}</h4>
                <p className="text-[#8B949E] text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-black py-20 px-4 sm:px-6 lg:px-[5vw]">
        <div className="max-w-[1000px] mx-auto text-center">
          <h2 className="text-white font-semibold text-3xl mb-12">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((m) => (
              <div key={m.name} className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-xl bg-[#161B22] border border-[#30363D] flex items-center justify-center">
                  <span className="text-[#01D7D5] font-semibold text-xl">{m.initials}</span>
                </div>
                <h4 className="text-white font-medium">{m.name}</h4>
                <p className="text-[#01D7D5] text-sm">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
