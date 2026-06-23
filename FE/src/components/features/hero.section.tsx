import SearchBar from "@/components/features/navigation/search-bar"
import HeroSlideshow from "@/components/sections/home/hero-slideshow"
import TextRotator from "@/components/features/text-rotater"

interface HeroSectionProps {
  height?: number;
}

export const HeroSection = ({ height = 400 }: HeroSectionProps) => {
    return(
        <div className="relative w-full" style={{ height: `${height}px` }}>
            <HeroSlideshow />
            <div className="absolute w-full top-14 left-1/2 translate-x-[-50%] max-w-[1200px] mx-auto px-4 z-10">
                <div className="mt-24 text-center md:text-left md:ml-2 lg:ml-0">
                    <TextRotator />
                </div>
                <div className="mt-8">
                    <SearchBar />
                </div>
            </div>
      </div>
    )
}