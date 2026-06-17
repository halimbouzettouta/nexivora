import HeroSection from '@/sections/HeroSection'
import FeaturedProducts from '@/sections/FeaturedProducts'
import WhyChooseUs from '@/sections/WhyChooseUs'
import HowItWorks from '@/sections/HowItWorks'
import SubscriptionPlans from '@/sections/SubscriptionPlans'
import LoyaltyProgram from '@/sections/LoyaltyProgram'
import Testimonials from '@/sections/Testimonials'
import DealerMapPreview from '@/sections/DealerMapPreview'
import EducationalPreview from '@/sections/EducationalPreview'

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <WhyChooseUs />
      <HowItWorks />
      <SubscriptionPlans />
      <LoyaltyProgram />
      <Testimonials />
      <DealerMapPreview />
      <EducationalPreview />
    </>
  )
}
