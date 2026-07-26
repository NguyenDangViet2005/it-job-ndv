'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Typed from 'typed.js'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'
import { useAuth } from '@/lib/hooks/useAuth'
import { ModeToggle } from '@/components/features/toggle-theme'
import { LottieAnimation } from '@/components/common/lottie-animation'
import { AppLogo } from '@/components/common/app-logo'

interface SlideData {
  id: number
  lottie: string
  badge: string
  titlePrimary: string
  titleSecondary: string
  subtitle: string
  typedStrings: string[]
  features: {
    title: string
    desc: string
    iconSvg: React.ReactNode
  }[]
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    lottie: '/media/welcome.json',
    badge: 'Nền tảng tuyển dụng thế hệ mới',
    titlePrimary: 'Kết nối',
    titleSecondary: 'nhân tài IT',
    subtitle:
      'Hệ sinh thái tuyển dụng công nghệ hàng đầu, kết nối lập trình viên xuất sắc với các doanh nghiệp uy tín.',
    typedStrings: [
      'Hệ sinh thái tuyển dụng IT toàn diện.',
      'Nơi cơ hội gặp gỡ tài năng.',
      'Đơn giản hóa quy trình, tối ưu hóa kết quả.',
    ],
    features: [
      {
        title: 'Hàng ngàn việc làm IT',
        desc: 'Cơ hội việc làm từ các công ty công nghệ hàng đầu',
        iconSvg: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        ),
      },
      {
        title: 'Ứng tuyển nhanh chóng',
        desc: 'Quy trình đơn giản, phản hồi nhanh từ nhà tuyển dụng',
        iconSvg: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        ),
      },
    ],
  },
  {
    id: 2,
    lottie: '/media/it-deal.json',
    badge: 'Cơ hội nghề nghiệp bứt phá',
    titlePrimary: 'Deal lương IT',
    titleSecondary: 'xứng tầm giá trị',
    subtitle:
      'Cơ hội tiếp cận các vị trí công việc IT chất lượng cao với chế độ đãi ngộ minh bạch và mức lương cạnh tranh.',
    typedStrings: [
      'Khám phá các vị trí tuyển dụng lương cao.',
      'Minh bạch thu nhập & đãi ngộ hấp dẫn.',
      'Tự tin đàm phán mức lương mơ ước.',
    ],
    features: [
      {
        title: 'Minh bạch thu nhập',
        desc: 'Thông tin mức lương công khai, đãi ngộ cạnh tranh',
        iconSvg: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        ),
      },
      {
        title: 'Thưởng & Phúc lợi cao',
        desc: 'Chế độ bảo hiểm, thưởng Tết & phúc lợi hàng đầu',
        iconSvg: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        ),
      },
    ],
  },
  {
    id: 3,
    lottie: '/media/language.json',
    badge: 'Đa dạng công nghệ & ngôn ngữ',
    titlePrimary: 'Làm chủ',
    titleSecondary: 'mọi Tech Stack',
    subtitle:
      'Khám phá hàng ngàn cơ hội tuyển dụng đa dạng Tech Stack từ Frontend, Backend, Mobile đến AI & Cloud Computing.',
    typedStrings: [
      'Từ ReactJS, Node.js, Python đến AI & Cloud.',
      'Tìm kiếm cơ hội đúng ngôn ngữ yêu thích.',
      'Phát triển sự nghiệp công nghệ không giới hạn.',
    ],
    features: [
      {
        title: 'Đa dạng ngôn ngữ lập trình',
        desc: 'Frontend, Backend, Mobile, DevOps, AI & Data Science',
        iconSvg: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        ),
      },
      {
        title: 'Phù hợp mọi cấp độ',
        desc: 'Tuyển dụng từ Fresher, Junior đến Senior & Tech Lead',
        iconSvg: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        ),
      },
    ],
  },
]

const WelcomePage = () => {
  const el = useRef<HTMLParagraphElement>(null)
  const { user } = useAuth()
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  // Update typed text on slide change
  useEffect(() => {
    if (!el.current) return

    const typed = new Typed(el.current, {
      strings: SLIDES[currentSlideIndex].typedStrings,
      typeSpeed: 40,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: '|',
    })

    return () => {
      typed.destroy()
    }
  }, [currentSlideIndex])

  const currentSlide = SLIDES[currentSlideIndex]

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col justify-between overflow-hidden">
      {/* Header with Logo and Theme Toggle */}
      <div className="pt-5 px-6 lg:px-10 flex items-center justify-between">
        <Link href={ROUTES.HOME} className="cursor-target">
          <AppLogo width={160} height={80} />
        </Link>
        <ModeToggle />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center my-6 lg:my-10">
        {/* Left Side - Lottie Animation */}
        <div className="w-full lg:w-3/5 min-h-[40vh] lg:min-h-[50vh] flex items-center justify-center p-4 lg:p-6">
          <div className="w-full max-w-2xl flex items-center justify-center min-h-[350px] lg:min-h-[450px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="w-full flex justify-center"
              >
                <LottieAnimation
                  src={currentSlide.lottie}
                  className="w-full h-auto max-h-[400px] lg:max-h-[500px]"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side - Content (2 Distinct Blocks: Content on Top, Buttons at Bottom) */}
        <div className="w-full lg:w-2/5 flex flex-col justify-start p-6 text-[0.8rem]">
          <div className="w-full max-w-xl space-y-4">
            {/* Block 1: Content (Badge + Title + Subtitle + Typed + Features) */}
            <div className="h-[380px] sm:h-[390px] lg:h-[410px] flex flex-col justify-start overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  className="flex flex-col justify-start space-y-3 lg:space-y-4"
                >
                  {/* Badge */}
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-3.5 py-1.5 text-xs font-medium text-primary dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      {currentSlide.badge}
                    </div>
                  </div>

                  {/* Heading & Subtitle */}
                  <div className="space-y-2 lg:space-y-2.5">
                    <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight leading-tight">
                      <span className="bg-primary bg-clip-text text-transparent">
                        {currentSlide.titlePrimary}
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {' '}
                        {currentSlide.titleSecondary}
                      </span>
                    </h1>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                      {currentSlide.subtitle}
                    </p>

                    <div className="h-[30px] flex items-center">
                      <p
                        className="text-xs sm:text-sm text-primary font-semibold tracking-wide"
                        ref={el}
                      ></p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 gap-2 lg:gap-2.5 pt-1">
                    {currentSlide.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-left"
                      >
                        <div className="mt-0.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 p-1.5 flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            {feat.iconSvg}
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            {feat.title}
                          </h3>
                          <p className="text-[11px] text-gray-700 dark:text-gray-400">
                            {feat.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Block 2: Buttons (Div riêng biệt bên dưới) */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800/60">
              <div className="flex flex-col sm:flex-row gap-3">
                {user ? (
                  <div className="flex-1 flex items-center justify-center h-12">
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                      Xin chào, {user.fullname}
                    </span>
                  </div>
                ) : (
                  <Link href={ROUTES.LOGIN} className="flex-1">
                    <Button
                      variant="outline"
                      className="cursor-pointer w-full text-base font-semibold px-8 h-12 border-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                    >
                      Đăng nhập
                    </Button>
                  </Link>
                )}
                <Link href={ROUTES.HOME} className="flex-1">
                  <Button
                    variant="outline"
                    className="cursor-pointer w-full text-primary font-semibold px-8 h-12 bg-white hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105 border-primary"
                  >
                    Khám phá việc làm
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage
