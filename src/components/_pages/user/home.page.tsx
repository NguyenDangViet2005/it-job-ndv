import BlogSection from "@/components/features/home/BlogSection";
import FeatureCards from "@/components/features/home/FeatureCards";
import FeaturedCompanies from "@/components/features/home/FeaturedCompanies";
import FeatureHr from "@/components/features/home/FeatureHr";
import JobToday from "@/components/features/home/JobToday";
import NewestJob from "@/components/features/home/NewestJob";
import { HeroSection } from "@/components/features/hero.section";
import SubscribeCTA from "@/components/features/home/SubscribeCTA";

function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection height={500} />

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
            <BlogSection />
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

