import QASection from "@/sections/user/home/QA.section";
import FeatureCards from "@/sections/user/home/feature-cards.section";
import FeaturedCompanies from "@/sections/user/home/feature-company.section";
import FeatureHr from "@/sections/user/home/feature-hr.section";
import JobToday from "@/sections/user/home/job-today.section";
import NewestJob from "@/sections/user/home/newest-job.section";
import { HeroSection } from "@/sections/user/common/hero.section";
import SubscribeCTA from "@/sections/user/home/subscribe-cta.section";

function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection height={500}/>

      <div className="bg-background w-full rounded-t-3xl border-t border-border/50 -mt-20 relative z-10 shadow-2xl shadow-black/5">
        <div className="w-[90%] max-w-[1400px] mx-auto px-4">
          <div className="z-10 -translate-y-20">
            <FeatureCards />
          </div>
          <div className="-mt-10">
            <FeaturedCompanies />
          </div>
          <div>
            <FeatureHr />
          </div>
          <div className="pt-10">
            <JobToday />
          </div>
          <div className="pt-10">
            <NewestJob />
          </div>
          <div className="py-20">
            <QASection />
          </div>
          <div className="">
            <SubscribeCTA />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
