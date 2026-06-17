import { Link } from 'react-router'
import { useLanguage } from '@/hooks/useLanguage'
import InteractiveMap from '@/components/InteractiveMap'

const PREVIEW_DEALERS = [
  { id: 1, name: 'Nexivora Algiers Center', city: 'Algiers', region: 'Center', address: '123 Boulevard Mohamed VI, Algiers', phone: '0234-567-890', hours: 'Sat-Thu 9AM-6PM', lat: 36.7538, lng: 3.0588 },
  { id: 2, name: 'Nexivora Oran Showroom', city: 'Oran', region: 'West', address: '45 Avenue Emir Abdelkader, Oran', phone: '0412-345-678', hours: 'Sat-Thu 9AM-7PM', lat: 35.6971, lng: -0.6308 },
  { id: 3, name: 'Nexivora Constantine', city: 'Constantine', region: 'East', address: '78 Rue Ahmed Bey, Constantine', phone: '0315-678-901', hours: 'Sat-Thu 8:30AM-5:30PM', lat: 36.3650, lng: 6.6147 },
  { id: 4, name: 'Nexivora Annaba', city: 'Annaba', region: 'East', address: '12 Boulevard Colonel Amirouche, Annaba', phone: '0238-901-234', hours: 'Sat-Thu 9AM-6PM', lat: 36.9044, lng: 7.7564 },
  { id: 5, name: 'Nexivora Blida', city: 'Blida', region: 'Center', address: '34 Route de Soumaa, Blida', phone: '0235-456-789', hours: 'Sat-Thu 9AM-6PM', lat: 36.4738, lng: 2.8324 },
  { id: 6, name: 'Nexivora Setif', city: 'Setif', region: 'East', address: '56 Avenue du 1er Novembre, Setif', phone: '0236-789-012', hours: 'Sat-Thu 8:30AM-5:30PM', lat: 36.1911, lng: 5.4137 },
  { id: 7, name: 'Nexivora Tlemcen', city: 'Tlemcen', region: 'West', address: '89 Rue de la Grande Mosque, Tlemcen', phone: '0243-567-890', hours: 'Sat-Thu 9AM-6PM', lat: 34.8828, lng: -1.3167 },
  { id: 8, name: 'Nexivora Batna', city: 'Batna', region: 'East', address: '23 Avenue des Freres Bouadou, Batna', phone: '0233-456-789', hours: 'Sat-Thu 9AM-6PM', lat: 35.5559, lng: 6.1741 },
]

export default function DealerMapPreview() {
  const { t } = useLanguage()

  return (
    <section id="dealers" className="w-full bg-black py-20 px-4 sm:px-6 lg:px-[5vw]">
      <div className="max-w-[1200px] mx-auto text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-[#484F58] uppercase mb-4">
          {t('dealers.title')}
        </p>
        <h2
          className="text-white font-semibold leading-tight tracking-[-0.02em] mb-3"
          style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
        >
          {t('dealers.subtitle')}
        </h2>
        <p className="text-[#8B949E] leading-relaxed max-w-[560px] mx-auto mb-10" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
          {t('dealers.desc')}
        </p>

        <div className="w-full h-[400px] rounded-xl overflow-hidden border border-[#30363D] mb-8 bg-[#161B22]">
          <InteractiveMap dealers={PREVIEW_DEALERS} />
        </div>

        <Link
          to="/dealers"
          className="inline-flex items-center gap-2 px-6 py-3 border border-[#01D7D5] text-[#01D7D5] rounded-lg text-sm font-medium hover:bg-[#01D7D5] hover:text-black transition-all duration-300"
        >
          {t('dealers.viewMap')}
        </Link>
      </div>
    </section>
  )
}
