import { HeroSection } from "@/components/features/hero.section";
import QuickFeatureSection from "@/components/sections/home/quick-feature.section";
import FeaturedCompanieSection from "@/components/sections/home/feature-company.section";
import TopHRSection from "@/components/sections/home/top-hr.section";
import NewestJobSection from "@/components/sections/home/newest-job.section";
import JobTodaySection from "@/components/sections/home/job-today.section";
import QuickBlogSection from "@/components/sections/home/quick-blog.section";
import SubscribeCTASection from "@/components/features/subcribe-cta.section";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden pb-20 sm:pb-0">
      <HeroSection height={500} />

      <div className="bg-background w-full rounded-t-3xl border-t border-border/50 -mt-20 relative z-10 shadow-2xl shadow-black/5">
        <div className="w-[90%] max-w-[1400px] mx-auto lg:px-4">
          <div className="z-10 -translate-y-20">
            <QuickFeatureSection />
          </div>
          <div className="-mt-8 lg:-mt-10">
            <FeaturedCompanieSection />
          </div>
          <div className="pt-4 lg:pt-0">
            <TopHRSection />
          </div>
          <div className="pt-6 lg:pt-10">
            <JobTodaySection />
          </div>
          <div className="pt-6 lg:pt-10">
            <NewestJobSection />
          </div>
          <div className="py-10 lg:py-20">
            <QuickBlogSection />
          </div>
          <div className="pb-6 sm:pb-6">
            <SubscribeCTASection />
          </div>
        </div>
      </div>
    </div>
  );
}


