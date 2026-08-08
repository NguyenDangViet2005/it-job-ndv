import { HeroSection } from "@/components/features/hero.section";
import QuickFeatureSection from "@/components/sections/home/quick-feature.section";
import FeaturedCompanieSection from "@/components/sections/home/feature-company.section";
import TopHRSection from "@/components/sections/home/top-hr.section";
import NewestJobSection from "@/components/sections/home/newest-job.section";
import JobTodaySection from "@/components/sections/home/job-today.section";
import QuickBlogSection from "@/components/sections/home/quick-blog.section";
import SubscribeCTASection from "@/components/features/subcribe-cta.section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden pb-20 sm:pb-12">
      <HeroSection />

      <div className="w-[90%] max-w-[1400px] mx-auto lg:px-4 pt-10 space-y-12">
        <ScrollReveal direction="up" distance={30} duration={0.8}>
          <QuickFeatureSection />
        </ScrollReveal>
        
        <ScrollReveal direction="up" distance={40} duration={0.8}>
          <FeaturedCompanieSection />
        </ScrollReveal>

        <ScrollReveal direction="up" distance={40} duration={0.8}>
          <TopHRSection />
        </ScrollReveal>

        <ScrollReveal direction="up" distance={40} duration={0.8}>
          <JobTodaySection />
        </ScrollReveal>

        <ScrollReveal direction="up" distance={40} duration={0.8}>
          <NewestJobSection />
        </ScrollReveal>

        <ScrollReveal direction="up" distance={40} duration={0.8}>
          <QuickBlogSection />
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} duration={0.8}>
          <SubscribeCTASection />
        </ScrollReveal>
      </div>
    </div>
  );
}



