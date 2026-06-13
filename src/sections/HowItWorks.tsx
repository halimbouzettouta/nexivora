import { useLanguage } from '@/hooks/useLanguage'

export default function HowItWorks() {
  const { t, lang } = useLanguage()

  const steps = [
    { num: '01', title: t('section.step1'), desc: t('section.step1Desc') },
    { num: '02', title: t('section.step2'), desc: t('section.step2Desc') },
    { num: '03', title: t('section.step3'), desc: t('section.step3Desc') },
  ]

  return (
    <section className="w-full bg-[#0A0A0A] py-20 px-4 sm:px-6 lg:px-[5vw]">
      <div className="max-w-[960px] mx-auto text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-[#484F58] uppercase mb-4">
          {t('section.howBadge')}
        </p>
        <h2
          className="text-white font-semibold leading-tight tracking-[-0.02em] mb-14"
          style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
        >
          {t('section.howTitle')}
        </h2>

        <div className="flex flex-col md:flex-row gap-8 md:gap-6 justify-center items-stretch">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex-1 flex flex-col items-center text-center max-w-[280px] mx-auto">
              <span className="text-white font-semibold text-7xl leading-none mb-4" style={{ color: '#30363D' }}>
                {step.num}
              </span>
              <h4 className="text-white font-medium text-lg mb-2">{step.title}</h4>
              <p className="text-[#8B949E] text-sm leading-relaxed">{step.desc}</p>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-8 h-px bg-[#30363D]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
