import { useState } from 'react'
import { Link } from 'react-router'
import { useToastStore } from '@/hooks/useToast'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube, Send, Check } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

const subjectsEn = ['General Inquiry', 'Support', 'Partnership', 'Dealer Application']
const subjectsAr = ['استفسار عام', 'دعم', 'شراكة', 'طلب موزع']
const subjectsFr = ['Demande Générale', 'Support', 'Partenariat', 'Candidature Concessionnaire']

export default function Contact() {
  const { t, lang } = useLanguage()
  const [sent, setSent] = useState(false)
  const addToast = useToastStore((s) => s.addToast)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })

  const isAr = lang === 'ar'
  const isFr = lang === 'fr'

  const subjects = isAr ? subjectsAr : isFr ? subjectsFr : subjectsEn

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    addToast({ title: t('contact.sent'), message: t('contact.reply'), type: 'success' })
    setTimeout(() => setSent(false), 4000)
    setForm({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-black pt-[90px]">
      <div className="bg-black pt-16 pb-8 px-4 sm:px-6 lg:px-[5vw]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 text-sm text-[#484F58] mb-4">
            <Link to="/" className="hover:text-[#01D7D5]">{t('nav.home')}</Link>
            <span>/</span>
            <span className="text-[#8B949E]">{t('nav.dealers') === 'الموزعون' ? 'اتصل بنا' : isFr ? 'Contact' : 'Contact'}</span>
          </div>
          <h1 className="text-white font-semibold text-4xl mb-2">{t('contact.getInTouch')}</h1>
          <p className="text-[#8B949E] max-w-[560px]" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
            {t('contact.helpText')}
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
                <h3 className="text-white font-semibold text-xl mb-2">{t('contact.msgSuccess')}</h3>
                <p className="text-[#8B949E]">{t('contact.msgReply')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[#8B949E] text-sm mb-1 block">{t('contact.fullName')}</label>
                  <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="text-[#8B949E] text-sm mb-1 block">{t('login.email')}</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="text-[#8B949E] text-sm mb-1 block">{t('contact.phoneLabel')}</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="text-[#8B949E] text-sm mb-1 block">{t('contact.subjectLabel')}</label>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none transition-all">
                    <option value="">{isAr ? 'اختر موضوعاً' : isFr ? 'Choisir un sujet' : 'Select a subject'}</option>
                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[#8B949E] text-sm mb-1 block">{t('contact.messageLabel')}</label>
                  <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none transition-all resize-none" />
                </div>
                <button type="submit"
                  className="w-full py-4 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                  <Send size={18} />
                  {t('contact.sendMessage')}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-6">{t('contact.info')}</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <MapPin size={20} className="text-[#01D7D5] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">{t('contact.addressLabel')}</p>
                    <p className="text-[#8B949E] text-sm">123 Innovation Boulevard, our headquarters</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone size={20} className="text-[#01D7D5] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">{t('contact.phoneInfo')}</p>
                    <p className="text-[#8B949E] text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail size={20} className="text-[#01D7D5] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">{t('contact.emailInfo')}</p>
                    <p className="text-[#8B949E] text-sm">contact@nexivora.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock size={20} className="text-[#01D7D5] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">{t('contact.bizHours')}</p>
                    <p className="text-[#8B949E] text-sm">{isAr ? 'السبت - الخميس: 9:00 - 18:00' : isFr ? 'Dim - Jeu : 9h00 - 18h00' : 'Sun - Thu: 9:00 AM - 6:00 PM'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-4">{t('contact.followUs')}</h3>
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
