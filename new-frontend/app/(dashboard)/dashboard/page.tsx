// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useRouter } from "next/navigation"
// import { useUser } from "@/hooks/useUser"
// import { getPublicSettings } from "@/lib/api"
// import {
//   FileText,
//   Wallet,
//   ArrowRight,
//   ChevronLeft,
//   ChevronRight,
//   Zap,
//   TrendingUp,
// } from "lucide-react"

// type TMarqueeItem = {
//   text: string
//   active: boolean
//   order: number
// }

// type TPublicSettingsResponse = {
//   success?: boolean
//   data?: {
//     marqueeEnabled?: boolean
//     marqueeSpeed?: number
//     marqueeItems?: TMarqueeItem[]
//     supportWhatsapp?: string
//   }
// }

// const slides = [
//   {
//     id: 1,
//     title: "ICTSeba-তে স্বাগতম !",
//     subtitle: "সার্ভার কপি এখন আরও সহজ",
//     bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
//     accent: "#e94560",
//     emoji: "🚀",
//   },
//   {
//     id: 2,
//     title: "Server Copy সেবা চালু রয়েছে",
//     subtitle: "মাত্র ৳৭০ টাকায় সার্ভার কপি",
//     bg: "linear-gradient(135deg, #0d1b2a 0%, #1b4332 50%, #2d6a4f 100%)",
//     accent: "#52b788",
//     emoji: "✅",
//   },
//   {
//     id: 3,
//     title: "bKash দিয়ে রিচার্জ করুন",
//     subtitle: "সহজ ও নিরাপদ পেমেন্ট",
//     bg: "linear-gradient(135deg, #2d0036 0%, #6a0572 50%, #ab1f91 100%)",
//     accent: "#e040fb",
//     emoji: "💳",
//   },
// ]

// const services = [
//   {
//     id: "server-copy",
//     title: "সার্ভার কপি",
//     subtitle: "NID যাচাই ও PDF",
//     price: "৳৭০",
//     priceLabel: "প্রতি কপি",
//     icon: FileText,
//     href: "/workplace/server-copy",
//     gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     shadow: "rgba(102,126,234,0.35)",
//   },
//   {
//     id: "recharge",
//     title: "ওয়ালেট রিচার্জ",
//     subtitle: "bKash দিয়ে",
//     price: "৳১০+",
//     priceLabel: "সর্বনিম্ন",
//     icon: Wallet,
//     href: "/recharge",
//     gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
//     shadow: "rgba(245,87,108,0.35)",
//   },
//   {
//     id: "transactions",
//     title: "লেনদেন",
//     subtitle: "ইতিহাস দেখুন",
//     price: "",
//     priceLabel: "সব রেকর্ড",
//     icon: TrendingUp,
//     href: "/recharge-history",
//     gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
//     shadow: "rgba(79,172,254,0.35)",
//   },
// ]

// const fallbackNotices = [
//   "🔔 স্বাগতম! আমাদের সার্ভার কপি সেবা এখন সক্রিয়।",
//   "💡 সার্ভার কপি করতে মাত্র ৳৭০ লাগবে।",
//   "✅ bKash দিয়ে সহজেই ওয়ালেট রিচার্জ করুন।",
//   "📋 যেকোনো সমস্যায় সহায়তার জন্য আমাদের WhatsApp নম্বর 01973346401-এ যোগাযোগ করুন।",
// ]

// export default function DashboardPage() {
//   const { user, loading } = useUser()
//   const router = useRouter()

//   const [currentSlide, setCurrentSlide] = useState(0)
//   const [isPaused, setIsPaused] = useState(false)
//   const [touchStart, setTouchStart] = useState(0)
//   const [touchEnd, setTouchEnd] = useState(0)

//   const [notices, setNotices] = useState<string[]>(fallbackNotices)
//   const [marqueeEnabled, setMarqueeEnabled] = useState(true)
//   const [marqueeSpeed, setMarqueeSpeed] = useState(35)

//   const intervalRef = useRef<NodeJS.Timeout | null>(null)

//   const balance = user?.wallet?.balance ?? 0
//   const isAdmin = user?.role === "admin" || user?.role === "super_admin"

//   useEffect(() => {
//     const loadPublicSettings = async () => {
//       try {
//         const result: TPublicSettingsResponse = await getPublicSettings()

//         if (!result?.success || !result?.data) return

//         const settings = result.data

//         setMarqueeEnabled(settings.marqueeEnabled ?? true)
//         setMarqueeSpeed(settings.marqueeSpeed ?? 35)

//         const activeNotices =
//           settings.marqueeItems
//             ?.filter((item) => item.active)
//             .sort((a, b) => a.order - b.order)
//             .map((item) => item.text)
//             .filter(Boolean) ?? []

//         if (activeNotices.length > 0) {
//           setNotices(activeNotices)
//         }
//       } catch (error) {
//         console.error("Failed to load public settings", error)
//       }
//     }

//     loadPublicSettings()
//   }, [])

//   useEffect(() => {
//     if (!isPaused) {
//       intervalRef.current = setInterval(() => {
//         setCurrentSlide((prev) => (prev + 1) % slides.length)
//       }, 3500)
//     }

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current)
//     }
//   }, [isPaused])

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
//   }

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length)
//   }

//   const handleTouchStart = (e: React.TouchEvent) => {
//     setTouchStart(e.targetTouches[0].clientX)
//   }

//   const handleTouchMove = (e: React.TouchEvent) => {
//     setTouchEnd(e.targetTouches[0].clientX)
//   }

//   const handleTouchEnd = () => {
//     if (touchStart - touchEnd > 50) nextSlide()
//     if (touchEnd - touchStart > 50) prevSlide()
//   }


//   const marqueeTrackRef = useRef<HTMLDivElement>(null)
//   const animationRef = useRef<number | null>(null)
//   const positionRef = useRef(0)

//   useEffect(() => {
//     // আগের animation বন্ধ করো
//     if (animationRef.current) {
//       cancelAnimationFrame(animationRef.current)
//       animationRef.current = null
//     }

//     if (!marqueeEnabled || notices.length === 0) return

//     // DOM render হওয়ার পর শুরু করো
//     const timer = setTimeout(() => {
//       const track = marqueeTrackRef.current
//       if (!track) return

//       positionRef.current = 0
//       track.style.transform = `translateX(0px)`

//       const pixelsPerFrame = (marqueeSpeed / 100) * 4 + 0.5

//       const animate = () => {
//         const track = marqueeTrackRef.current
//         if (!track) return

//         positionRef.current -= pixelsPerFrame

//         const halfWidth = track.scrollWidth / 2
//         if (Math.abs(positionRef.current) >= halfWidth) {
//           positionRef.current = 0
//         }

//         track.style.transform = `translateX(${positionRef.current}px)`
//         animationRef.current = requestAnimationFrame(animate)
//       }

//       animationRef.current = requestAnimationFrame(animate)
//     }, 100) // 100ms delay দিলে DOM ready থাকবে

//     return () => {
//       clearTimeout(timer)
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current)
//         animationRef.current = null
//       }
//     }
//   }, [marqueeSpeed, marqueeEnabled, notices])

//   return (
//     <>
//       <style>{`


//         .dash-wrapper {
//           max-width: 960px;
//           margin: 0 auto;
//           padding: 0 0 48px;
//         }

//         .welcome-bar {
//           padding: 12px 16px;
//           margin-bottom: 16px;
//           background: linear-gradient(90deg, hsl(var(--primary)/0.1), transparent);
//           border-left: 3px solid hsl(var(--primary));
//           border-radius: 0 8px 8px 0;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           flex-wrap: wrap;
//           gap: 8px;
//         }

//         .welcome-text {
//           font-size: 15px;
//           font-weight: 600;
//           line-height: 1.4;
//         }

//         .welcome-sub {
//           font-size: 12px;
//           color: hsl(var(--muted-foreground));
//           margin-top: 2px;
//         }

//         .balance-badge {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           background: hsl(var(--primary)/0.15);
//           padding: 6px 14px;
//           border-radius: 20px;
//           font-size: 14px;
//           font-weight: 700;
//           white-space: nowrap;
//         }

//         .marquee-wrap {
//           overflow: hidden;
//           background: hsl(var(--primary));
//           color: #0c0202;
//           padding: 8px 0;
//           margin-bottom: 18px;
//           border-radius: 8px;
//         }

//         .marquee-track {
//           display: flex;
//           gap: 60px;
//           white-space: nowrap;
//           width: max-content;
//         }

//         .marquee-item {
//           font-size: 13px;
//           font-weight: 500;
//         }

//         .slider-wrap {
//           position: relative;
//           border-radius: 16px;
//           overflow: hidden;
//           margin-bottom: 24px;
//           user-select: none;
//         }

//         .slide-body {
//           height: 190px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-direction: column;
//           gap: 8px;
//           transition: background 0.6s ease;
//           position: relative;
//           overflow: hidden;
//         }

//         .slide-deco1 {
//           position: absolute;
//           right: -20px;
//           top: -20px;
//           width: 200px;
//           height: 200px;
//           border-radius: 50%;
//           opacity: 0.08;
//         }

//         .slide-deco2 {
//           position: absolute;
//           left: -40px;
//           bottom: -40px;
//           width: 250px;
//           height: 250px;
//           border-radius: 50%;
//           opacity: 0.06;
//         }

//         .slide-emoji { font-size: 44px; line-height: 1; }

//         .slide-title {
//           font-size: 20px;
//           font-weight: 700;
//           color: #fff;
//           text-align: center;
//           padding: 0 60px;
//           line-height: 1.3;
//         }

//         .slide-sub {
//           font-size: 13px;
//           font-weight: 600;
//           padding: 4px 16px;
//           border-radius: 20px;
//           background: rgba(255,255,255,0.12);
//         }

//         .slide-btn {
//           position: absolute;
//           top: 50%;
//           transform: translateY(-50%);
//           background: rgba(255,255,255,0.2);
//           border: none;
//           border-radius: 50%;
//           width: 34px;
//           height: 34px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           color: #fff;
//           backdrop-filter: blur(4px);
//           transition: background 0.2s;
//           z-index: 2;
//         }

//         .slide-btn:hover { background: rgba(255,255,255,0.35); }
//         .slide-btn-left { left: 10px; }
//         .slide-btn-right { right: 10px; }

//         .slide-dots {
//           position: absolute;
//           bottom: 10px;
//           left: 50%;
//           transform: translateX(-50%);
//           display: flex;
//           gap: 6px;
//         }

//         .slide-dot {
//           height: 8px;
//           border-radius: 4px;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .section-title {
//           font-size: 15px;
//           font-weight: 700;
//           margin-bottom: 14px;
//           display: flex;
//           align-items: center;
//           gap: 7px;
//         }

//         .cards-grid {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 14px;
//         }

//         .service-card {
//           border-radius: 16px;
//           padding: 18px 16px;
//           cursor: pointer;
//           position: relative;
//           overflow: hidden;
//           transition: transform 0.2s ease, box-shadow 0.2s ease;
//           -webkit-tap-highlight-color: transparent;
//         }

//         .service-card:active { transform: scale(0.97) !important; }

//         .card-deco {
//           position: absolute;
//           right: -15px;
//           top: -15px;
//           width: 75px;
//           height: 75px;
//           border-radius: 50%;
//           background: rgba(255,255,255,0.15);
//         }

//         .card-icon-wrap {
//           width: 42px;
//           height: 42px;
//           border-radius: 11px;
//           background: rgba(255,255,255,0.25);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-bottom: 11px;
//         }

//         .card-title {
//           font-size: 15px;
//           font-weight: 700;
//           color: #fff;
//           margin-bottom: 2px;
//         }

//         .card-sub {
//           font-size: 11px;
//           color: rgba(255,255,255,0.75);
//           margin-bottom: 12px;
//         }

//         .card-footer {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//         }

//         .card-price {
//           font-size: 17px;
//           font-weight: 800;
//           color: #fff;
//         }

//         .card-price-label {
//           font-size: 10px;
//           color: rgba(255,255,255,0.7);
//           margin-top: 1px;
//         }

//         .card-arrow {
//           width: 30px;
//           height: 30px;
//           border-radius: 50%;
//           background: rgba(255,255,255,0.2);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-shrink: 0;
//         }

//         @media (max-width: 768px) {
//           .cards-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
//           .slide-title { font-size: 17px; padding: 0 50px; }
//           .slide-body { height: 170px; }
//         }

//         @media (max-width: 480px) {
//           .dash-wrapper { padding: 0 0 32px; }
//           .welcome-bar { padding: 10px 12px; }
//           .welcome-text { font-size: 14px; }
//           .balance-badge { font-size: 13px; padding: 5px 12px; }
//           .cards-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
//           .service-card { padding: 14px 12px; border-radius: 14px; }
//           .card-title { font-size: 13px; }
//           .card-sub { font-size: 10px; }
//           .card-price { font-size: 15px; }
//           .slide-body { height: 155px; }
//           .slide-title { font-size: 15px; padding: 0 44px; }
//           .slide-emoji { font-size: 36px; }
//           .slide-btn { width: 28px; height: 28px; }
//           .marquee-item { font-size: 12px; }
//           .section-title { font-size: 14px; }
//         }

//         @media (max-width: 360px) {
//           .cards-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
//           .service-card { padding: 12px 10px; }
//           .card-icon-wrap { width: 36px; height: 36px; margin-bottom: 8px; }
//         }
//       `}</style>

//       <div className="dash-wrapper">
//         <div className="welcome-bar">
//           <div>
//             <div className="welcome-text">
//               👋 হ্যালো, {loading ? "..." : user?.name || "ব্যবহারকারী"}! স্বাগতম।
//             </div>
//             <div className="welcome-sub">
//               সতর্কতার সাথে ব্যবহার করুন এবং নিরাপদ থাকুন।
//             </div>
//           </div>

//           {!isAdmin && (
//             <div className="balance-badge">
//               <Wallet size={15} />
//               ব্যালেন্স: ৳{balance}
//             </div>
//           )}
//         </div>

//         {marqueeEnabled && notices.length > 0 && (
//           <div className="marquee-wrap">
//             <div
//               ref={marqueeTrackRef}
//               className="marquee-track"
//               style={{ animation: "none" }}
//             >
//               {[...notices, ...notices].map((notice, index) => (
//                 <span key={index} className="marquee-item">
//                   {notice}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}


//         <div
//           className="slider-wrap"
//           onMouseEnter={() => setIsPaused(true)}
//           onMouseLeave={() => setIsPaused(false)}
//           onTouchStart={handleTouchStart}
//           onTouchMove={handleTouchMove}
//           onTouchEnd={handleTouchEnd}
//         >
//           <div className="slide-body" style={{ background: slides[currentSlide].bg }}>
//             <div className="slide-deco1" style={{ background: slides[currentSlide].accent }} />
//             <div className="slide-deco2" style={{ background: slides[currentSlide].accent }} />
//             <div className="slide-emoji">{slides[currentSlide].emoji}</div>
//             <div className="slide-title">{slides[currentSlide].title}</div>
//             <div className="slide-sub" style={{ color: slides[currentSlide].accent }}>
//               {slides[currentSlide].subtitle}
//             </div>
//           </div>

//           <button className="slide-btn slide-btn-left" onClick={prevSlide}>
//             <ChevronLeft size={16} />
//           </button>
//           <button className="slide-btn slide-btn-right" onClick={nextSlide}>
//             <ChevronRight size={16} />
//           </button>

//           <div className="slide-dots">
//             {slides.map((_, index) => (
//               <div
//                 key={index}
//                 className="slide-dot"
//                 onClick={() => setCurrentSlide(index)}
//                 style={{
//                   width: index === currentSlide ? "20px" : "8px",
//                   background:
//                     index === currentSlide
//                       ? slides[currentSlide].accent
//                       : "rgba(255,255,255,0.4)",
//                 }}
//               />
//             ))}
//           </div>
//         </div>

//         <div className="section-title">
//           <Zap size={17} style={{ color: "hsl(var(--primary))" }} />
//           Quick Features
//         </div>

//         <div className="cards-grid">
//           {services.map((service) => {
//             const Icon = service.icon

//             return (
//               <div
//                 key={service.id}
//                 className="service-card"
//                 onClick={() => router.push(service.href)}
//                 style={{
//                   background: service.gradient,
//                   boxShadow: `0 8px 20px ${service.shadow}`,
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = "translateY(-4px)"
//                   e.currentTarget.style.boxShadow = `0 16px 30px ${service.shadow}`
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "translateY(0)"
//                   e.currentTarget.style.boxShadow = `0 8px 20px ${service.shadow}`
//                 }}
//               >
//                 <div className="card-deco" />
//                 <div className="card-icon-wrap">
//                   <Icon size={20} color="#fff" />
//                 </div>
//                 <div className="card-title">{service.title}</div>
//                 <div className="card-sub">{service.subtitle}</div>
//                 <div className="card-footer">
//                   <div>
//                     {service.price && <div className="card-price">{service.price}</div>}
//                     <div className="card-price-label">{service.priceLabel}</div>
//                   </div>
//                   <div className="card-arrow">
//                     <ArrowRight size={14} color="#fff" />
//                   </div>
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </div>
//     </>
//   )
// }



"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/useUser"
import { getPublicSettings } from "@/lib/api"
import {
  FileText,
  Wallet,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  TrendingUp,
} from "lucide-react"

type TMarqueeItem = {
  text: string
  active: boolean
  order: number
}

type TPublicSettingsResponse = {
  success?: boolean
  data?: {
    marqueeEnabled?: boolean
    marqueeSpeed?: number
    marqueeItems?: TMarqueeItem[]
    supportWhatsapp?: string
  }
}

const slides = [
  {
    id: 1,
    title: "ICTSeba-তে স্বাগতম !",
    subtitle: "সার্ভার কপি এখন আরও সহজ",
    bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    accent: "#e94560",
    emoji: "🚀",
  },
  {
    id: 2,
    title: "Server Copy সেবা চালু রয়েছে",
    subtitle: "মাত্র ৳৭০ টাকায় সার্ভার কপি",
    bg: "linear-gradient(135deg, #0d1b2a 0%, #1b4332 50%, #2d6a4f 100%)",
    accent: "#52b788",
    emoji: "✅",
  },
  {
    id: 3,
    title: "bKash দিয়ে রিচার্জ করুন",
    subtitle: "সহজ ও নিরাপদ পেমেন্ট",
    bg: "linear-gradient(135deg, #2d0036 0%, #6a0572 50%, #ab1f91 100%)",
    accent: "#e040fb",
    emoji: "💳",
  },
]

const services = [
  {
    id: "server-copy",
    title: "সার্ভার কপি",
    subtitle: "NID যাচাই ও PDF",
    price: "৳৭০",
    priceLabel: "প্রতি কপি",
    icon: FileText,
    href: "/workplace/server-copy",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    shadow: "rgba(102,126,234,0.35)",
  },
  {
    id: "recharge",
    title: "ওয়ালেট রিচার্জ",
    subtitle: "bKash দিয়ে",
    price: "৳১০+",
    priceLabel: "সর্বনিম্ন",
    icon: Wallet,
    href: "/recharge",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    shadow: "rgba(245,87,108,0.35)",
  },
  {
    id: "transactions",
    title: "লেনদেন",
    subtitle: "ইতিহাস দেখুন",
    price: "",
    priceLabel: "সব রেকর্ড",
    icon: TrendingUp,
    href: "/recharge-history",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    shadow: "rgba(79,172,254,0.35)",
  },
]

const fallbackNotices = [
  "🔔 স্বাগতম! আমাদের সার্ভার কপি সেবা এখন সক্রিয়।",
  "💡 সার্ভার কপি করতে মাত্র ৳৭০ লাগবে।",
  "✅ bKash দিয়ে সহজেই ওয়ালেট রিচার্জ করুন।",
  "📋 যেকোনো সমস্যায় সহায়তার জন্য আমাদের WhatsApp নম্বর 01973346401-এ যোগাযোগ করুন।",
]

export default function DashboardPage() {
  const { user, loading } = useUser()
  const router = useRouter()

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const [notices, setNotices] = useState<string[]>(fallbackNotices)
  const [marqueeEnabled, setMarqueeEnabled] = useState(true)
  const [marqueeSpeed, setMarqueeSpeed] = useState(35)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const marqueeTrackRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const positionRef = useRef(0)

  const balance = user?.wallet?.balance ?? 0
  const isAdmin = user?.role === "admin" || user?.role === "super_admin"

  useEffect(() => {
    const loadPublicSettings = async () => {
      try {
        const result: TPublicSettingsResponse = await getPublicSettings()

        if (!result?.success || !result?.data) return

        const settings = result.data
        setMarqueeEnabled(settings.marqueeEnabled ?? true)
        setMarqueeSpeed(settings.marqueeSpeed ?? 35)

        const activeNotices =
          settings.marqueeItems
            ?.filter((item) => item.active)
            .sort((a, b) => a.order - b.order)
            .map((item) => item.text)
            .filter(Boolean) ?? []

        if (activeNotices.length > 0) {
          setNotices(activeNotices)
        }
      } catch (error) {
        console.error("Failed to load public settings", error)
      }
    }

    loadPublicSettings()
  }, [])

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 3500)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused])

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    if (!marqueeEnabled || notices.length === 0) return

    const timer = setTimeout(() => {
      const track = marqueeTrackRef.current
      if (!track) return

      positionRef.current = 0
      track.style.transform = "translateX(0px)"

      const pixelsPerFrame = (marqueeSpeed / 100) * 4 + 0.5

      const animate = () => {
        const currentTrack = marqueeTrackRef.current
        if (!currentTrack) return

        positionRef.current -= pixelsPerFrame

        const halfWidth = currentTrack.scrollWidth / 2
        if (Math.abs(positionRef.current) >= halfWidth) {
          positionRef.current = 0
        }

        currentTrack.style.transform = `translateX(${positionRef.current}px)`
        animationRef.current = requestAnimationFrame(animate)
      }

      animationRef.current = requestAnimationFrame(animate)
    }, 100)

    return () => {
      clearTimeout(timer)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [marqueeSpeed, marqueeEnabled, notices])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) nextSlide()
    if (touchEnd - touchStart > 50) prevSlide()
  }

  return (
    <>
      <style>{`
        .dash-wrapper {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 0 48px;
        }

        .welcome-bar {
          padding: 12px 16px;
          margin-bottom: 16px;
          background: linear-gradient(90deg, hsl(var(--primary) / 0.12), transparent);
          border-left: 3px solid hsl(var(--primary));
          border-radius: 0 12px 12px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .welcome-text {
          font-size: 15px;
          font-weight: 600;
          line-height: 1.4;
          color: hsl(var(--foreground));
        }

        .welcome-sub {
          font-size: 12px;
          color: hsl(var(--muted-foreground));
          margin-top: 2px;
        }

        .balance-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: hsl(var(--primary) / 0.14);
          color: hsl(var(--foreground));
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 700;
          white-space: nowrap;
        }

        .marquee-wrap {
          overflow: hidden;
          background: linear-gradient(90deg, hsl(var(--primary) / 0.14), hsl(var(--accent) / 0.18));
          border: 1px solid hsl(var(--border));
          color: hsl(var(--foreground));
          padding: 9px 0;
          margin-bottom: 18px;
          border-radius: 12px;
        }

        .marquee-track {
          display: flex;
          gap: 60px;
          white-space: nowrap;
          width: max-content;
          will-change: transform;
        }

        .marquee-item {
          font-size: 13px;
          font-weight: 600;
          color: hsl(var(--foreground));
        }

        .slider-wrap {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          margin-bottom: 24px;
          user-select: none;
          box-shadow: 0 12px 28px rgba(0,0,0,0.12);
        }

        .slide-body {
          height: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 8px;
          transition: background 0.6s ease;
          position: relative;
          overflow: hidden;
        }

        .slide-deco1 {
          position: absolute;
          right: -20px;
          top: -20px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          opacity: 0.08;
        }

        .slide-deco2 {
          position: absolute;
          left: -40px;
          bottom: -40px;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          opacity: 0.06;
        }

        .slide-emoji { font-size: 44px; line-height: 1; }

        .slide-title {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          text-align: center;
          padding: 0 60px;
          line-height: 1.3;
        }

        .slide-sub {
          font-size: 13px;
          font-weight: 600;
          padding: 4px 16px;
          border-radius: 20px;
          background: rgba(255,255,255,0.12);
        }

        .slide-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 50%;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #fff;
          backdrop-filter: blur(4px);
          transition: background 0.2s;
          z-index: 2;
        }

        .slide-btn:hover { background: rgba(255,255,255,0.35); }
        .slide-btn-left { left: 10px; }
        .slide-btn-right { right: 10px; }

        .slide-dots {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
        }

        .slide-dot {
          height: 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .section-title {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 7px;
          color: hsl(var(--foreground));
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .service-card {
          border-radius: 18px;
          padding: 18px 16px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .service-card:active { transform: scale(0.97) !important; }

        .card-deco {
          position: absolute;
          right: -15px;
          top: -15px;
          width: 75px;
          height: 75px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
        }

        .card-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 11px;
          background: rgba(255,255,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 11px;
        }

        .card-title {
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 2px;
        }

        .card-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.75);
          margin-bottom: 12px;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-price {
          font-size: 17px;
          font-weight: 800;
          color: #fff;
        }

        .card-price-label {
          font-size: 10px;
          color: rgba(255,255,255,0.7);
          margin-top: 1px;
        }

        .card-arrow {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .cards-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .slide-title { font-size: 17px; padding: 0 50px; }
          .slide-body { height: 170px; }
        }

        @media (max-width: 480px) {
          .dash-wrapper { padding: 0 0 32px; }
          .welcome-bar { padding: 10px 12px; }
          .welcome-text { font-size: 14px; }
          .balance-badge { font-size: 13px; padding: 5px 12px; }
          .cards-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .service-card { padding: 14px 12px; border-radius: 14px; }
          .card-title { font-size: 13px; }
          .card-sub { font-size: 10px; }
          .card-price { font-size: 15px; }
          .slide-body { height: 155px; }
          .slide-title { font-size: 15px; padding: 0 44px; }
          .slide-emoji { font-size: 36px; }
          .slide-btn { width: 28px; height: 28px; }
          .marquee-item { font-size: 12px; }
          .section-title { font-size: 14px; }
        }

        @media (max-width: 360px) {
          .cards-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .service-card { padding: 12px 10px; }
          .card-icon-wrap { width: 36px; height: 36px; margin-bottom: 8px; }
        }
      `}</style>

      <div className="dash-wrapper">
        <div className="welcome-bar">
          <div>
            <div className="welcome-text">
              👋 হ্যালো, {loading ? "..." : user?.name || "ব্যবহারকারী"}! স্বাগতম।
            </div>
            <div className="welcome-sub">
              সতর্কতার সাথে ব্যবহার করুন এবং নিরাপদ থাকুন।
            </div>
          </div>

          {!isAdmin && (
            <div className="balance-badge">
              <Wallet size={15} />
              ব্যালেন্স: ৳{balance}
            </div>
          )}
        </div>

        {marqueeEnabled && notices.length > 0 && (
          <div className="marquee-wrap">
            <div ref={marqueeTrackRef} className="marquee-track">
              {[...notices, ...notices].map((notice, index) => (
                <span key={index} className="marquee-item">
                  {notice}
                </span>
              ))}
            </div>
          </div>
        )}

        <div
          className="slider-wrap"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="slide-body" style={{ background: slides[currentSlide].bg }}>
            <div className="slide-deco1" style={{ background: slides[currentSlide].accent }} />
            <div className="slide-deco2" style={{ background: slides[currentSlide].accent }} />
            <div className="slide-emoji">{slides[currentSlide].emoji}</div>
            <div className="slide-title">{slides[currentSlide].title}</div>
            <div className="slide-sub" style={{ color: slides[currentSlide].accent }}>
              {slides[currentSlide].subtitle}
            </div>
          </div>

          <button className="slide-btn slide-btn-left" onClick={prevSlide}>
            <ChevronLeft size={16} />
          </button>
          <button className="slide-btn slide-btn-right" onClick={nextSlide}>
            <ChevronRight size={16} />
          </button>

          <div className="slide-dots">
            {slides.map((_, index) => (
              <div
                key={index}
                className="slide-dot"
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: index === currentSlide ? "20px" : "8px",
                  background:
                    index === currentSlide
                      ? slides[currentSlide].accent
                      : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="section-title">
          <Zap size={17} style={{ color: "hsl(var(--primary))" }} />
          Quick Features
        </div>

        <div className="cards-grid">
          {services.map((service) => {
            const Icon = service.icon

            return (
              <div
                key={service.id}
                className="service-card"
                onClick={() => router.push(service.href)}
                style={{
                  background: service.gradient,
                  boxShadow: `0 8px 20px ${service.shadow}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = `0 16px 30px ${service.shadow}`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = `0 8px 20px ${service.shadow}`
                }}
              >
                <div className="card-deco" />
                <div className="card-icon-wrap">
                  <Icon size={20} color="#fff" />
                </div>
                <div className="card-title">{service.title}</div>
                <div className="card-sub">{service.subtitle}</div>
                <div className="card-footer">
                  <div>
                    {service.price && <div className="card-price">{service.price}</div>}
                    <div className="card-price-label">{service.priceLabel}</div>
                  </div>
                  <div className="card-arrow">
                    <ArrowRight size={14} color="#fff" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
