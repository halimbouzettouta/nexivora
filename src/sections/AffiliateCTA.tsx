import { Link } from 'react-router'
import { useLanguage } from '@/hooks/useLanguage'

export default function AffiliateCTA() {
  const { t, lang } = useLanguage()
  const isAr = lang === 'ar'
  const isFr = lang === 'fr'

  const title = isAr
    ? 'انضم إلى مجتمع نكسيفورا'
    : isFr
      ? 'Rejoignez la Communauté Nexivora'
      : 'Join the Nexivora Community'

  const desc = isAr
    ? 'كن جزءاً من مستقبل التنقل الكهربائي مع نكسيفورا. تواصل معنا واكتشف المزيد.'
    : isFr
      ? 'Faites partie de l\'avenir de la mobilité électrique avec Nexivora. Contactez-nous pour en savoir plus.'
      : 'Be part of the future of electric mobility with Nexivora. Connect with us to learn more.'

  return (
    <section className="w-full bg-[#0A0A0A] py-24 px-4 sm:px-6 lg:px-[5vw] text-center">
      <h2
        className="text-white font-semibold leading-tight tracking-[-0.02em] mb-4"
        style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
      >
        {title}
      </h2>
      <p className="text-[#8B949E] leading-relaxed max-w-[560px] mx-auto mb-10" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
        {desc}
      </p>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <Link
          to="/contact"
          className="px-10 py-4 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_30px_rgba(1,215,213,0.4)] hover:-translate-y-0.5 transition-all duration-300"
        >
          {isAr ? 'تواصل معنا' : isFr ? 'Contactez-Nous' : 'Contact Us'}
        </Link>
        <Link
          to="/store"
          className="px-10 py-4 border border-[#30363D] text-white font-medium rounded-lg hover:border-[#01D7D5] transition-colors duration-300"
        >
          {t('nav.store')}
        </Link>
      </div>
    </section>
  )
}
