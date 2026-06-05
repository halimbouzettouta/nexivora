import HeroSection from '@/sections/HeroSection'
import FeaturedProducts from '@/sections/FeaturedProducts'
import RankSystem from '@/sections/RankSystem'
import HowItWorks from '@/sections/HowItWorks'
import SubscriptionPlans from '@/sections/SubscriptionPlans'
import AffiliateCTA from '@/sections/AffiliateCTA'
import LoyaltyProgram from '@/sections/LoyaltyProgram'
import Testimonials from '@/sections/Testimonials'
import DealerMapPreview from '@/sections/DealerMapPreview'
import EducationalPreview from '@/sections/EducationalPreview'

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <RankSystem />
      <HowItWorks />
      <SubscriptionPlans />
      <AffiliateCTA />
      <LoyaltyProgram />
      <Testimonials />
      <DealerMapPreview />
      <EducationalPreview />
    </>
  )
}
