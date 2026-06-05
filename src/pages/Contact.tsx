import { useState } from 'react'
import { Link } from 'react-router'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube, Send, Check } from 'lucide-react'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' })
  }

  return (
    <div className="min-h-screen bg-black pt-[70px]">
      <div className="bg-black pt-16 pb-8 px-4 sm:px-6 lg:px-[5vw]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 text-sm text-[#484F58] mb-4">
            <Link to="/" className="hover:text-[#01D7D5]">Home</Link>
            <span>/</span>
            <span className="text-[#8B949E]">Contact</span>
          </div>
          <h1 className="text-white font-semibold text-4xl mb-2">Get in Touch</h1>
          <p className="text-[#8B949E] max-w-[560px]" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
            We&apos;re here to help. Reach out for support, partnership, or inquiries.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-[5vw] pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-[#161B22] border border-[#30363D] rounded-xl">
                <div className="w-16 h-16 bg-[rgba(1,215,213,0.15)] rounded-full flex items-center justify-center mb-4">
                  <Check size={32} className="text-[#01D7D5]" />
                </div>
                <h3 className="text-white font-semibold text-xl mb-2">Message sent successfully!</h3>
                <p className="text-[#8B949E]">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[#8B949E] text-sm mb-1 block">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none focus:ring-1 focus:ring-[#01D7D5]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[#8B949E] text-sm mb-1 block">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none focus:ring-1 focus:ring-[#01D7D5]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[#8B949E] text-sm mb-1 block">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none focus:ring-1 focus:ring-[#01D7D5]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[#8B949E] text-sm mb-1 block">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none focus:ring-1 focus:ring-[#01D7D5]/20 transition-all"
                  >
                    <option>General Inquiry</option>
                    <option>Support</option>
                    <option>Partnership</option>
                    <option>Dealer Application</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#8B949E] text-sm mb-1 block">Message *</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none focus:ring-1 focus:ring-[#01D7D5]/20 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-6">Contact Information</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <MapPin size={20} className="text-[#01D7D5] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Address</p>
                    <p className="text-[#8B949E] text-sm">123 Boulevard Mohamed VI, Algiers, Algeria</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone size={20} className="text-[#01D7D5] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Phone</p>
                    <p className="text-[#8B949E] text-sm">+213 555 123 456</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail size={20} className="text-[#01D7D5] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Email</p>
                    <p className="text-[#8B949E] text-sm">contact@eride-dz.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock size={20} className="text-[#01D7D5] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Business Hours</p>
                    <p className="text-[#8B949E] text-sm">Sun - Thu: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 bg-[#0A0A0A] border border-[#30363D] rounded-lg flex items-center justify-center text-[#8B949E] hover:text-[#01D7D5] hover:border-[#01D7D5] transition-all">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-[#0A0A0A] border border-[#30363D] rounded-lg flex items-center justify-center text-[#8B949E] hover:text-[#01D7D5] hover:border-[#01D7D5] transition-all">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-[#0A0A0A] border border-[#30363D] rounded-lg flex items-center justify-center text-[#8B949E] hover:text-[#01D7D5] hover:border-[#01D7D5] transition-all">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
