'use client'

import { LottieAnimation } from '@/components/common/lottie-animation'

interface LoadingScreenProps {
  fullScreen?: boolean
}

export default function LoadingScreen({
  fullScreen = true,
}: LoadingScreenProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-[9999] transition-all duration-300 ${
        fullScreen ? 'fixed inset-0 w-screen h-screen' : 'w-full py-12'
      }`}
    >
      <div className="relative flex flex-col items-center gap-4">
        {/* Glow behind the animation */}
        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl animate-pulse" />

        {/* Lottie Loading Animation */}
        <div className="relative flex items-center justify-center">
          <LottieAnimation
            src="/media/loading.json"
            className="w-48 h-48 md:w-64 md:h-64"
          />
        </div>
      </div>
    </div>
  )
}
