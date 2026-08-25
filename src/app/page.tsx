"use client";

import { TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import InfiniteMarquee, { FeatureItem } from "../components/home/infiniteMarquee";
import { 
  Users, 
  Shield, 
  Dumbbell, 
  Trophy, 
  GraduationCap, 
  Shirt, 
  Banknote, 
  Stethoscope,
} from "lucide-react";
import Chaos2Clarity from "../components/home/chaos2Clarity";


export default function Home() {
  const navItems = ["Features", "Modules", "Roles"];
  const avatarLinks = [
    "https://images.unsplash.com/photo-1615109398623-88346a601842?ixid=M3w4MjcwNjd8MHwxfHNlYXJjaHwxfHxodW1hbnxlbnwwfHx8fDE3ODc1NzY5NDZ8MA&ixlib=rb-4.1.0&fit=max&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=M3w4MjcwNjd8MHwxfHNlYXJjaHw2fHxodW1hbnxlbnwwfHx8fDE3ODc1NzY5NDZ8MA&ixlib=rb-4.1.0&fit=max&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixid=M3w4MjcwNjd8MHwxfHNlYXJjaHw3fHxodW1hbnxlbnwwfHx8fDE3ODc1NzY5NDZ8MA&ixlib=rb-4.1.0&fit=max&q=80",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixid=M3w4MjcwNjd8MHwxfHNlYXJjaHwxMHx8aHVtYW58ZW58MHx8fHwxNzg3NTc2OTQ2fDA&ixlib=rb-4.1.0&fit=max&q=80"
  ];
  const features: FeatureItem[] = [
    { label: "PLAYERS", icon: Users },
    { label: "TEAMS", icon: Shield },
    { label: "TRAINING", icon: Dumbbell },
    { label: "MATCHES", icon: Trophy },
    { label: "ACADEMY", icon: GraduationCap },
    { label: "KITS", icon: Shirt },
    { label: "FINANCE", icon: Banknote },
    { label: "MEDICAL", icon: Stethoscope },
  ];
  
  return (
    <div className="bg-quaternary">
      <header className="flex justify-between items-center w-full p-5 gap-5">
        <Link href="/" className="flex gap-2">
          <Image src="/logo-light-clip.jpeg" alt="ClubSheet" width={26} height={20} />
          <span className="text-2xl font-bold ml-2 text-primary">ClubSheet</span>
        </Link>

        <div className="flex gap-16">
          {navItems.map((item, ndx) => <Link key={ndx} href={`#${item}`} className="">{item}</Link> )}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="">Sign In</Link>
          <Link href="/register" className="bg-primary text-white px-3 py-2 rounded-[0.78rem]">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex w-screen">
        {/* Left hero section */}
        <div className="flex-1 pl-13 pt-[4.6rem] left-home-hero-section">
          {/* updated badge */}
          <div className="inline-flex items-center gap-2 bg-[#E5E9E1] rounded-[.4rem] px-3 py-1.5 self-center mx-auto">
            <div className="h-[.67rem] w-[.67rem] bg-primary rounded-full shrink-0 animate-swell" />
            <span className="font-semibold text-[.7rem] leading-none">NEW PLATFORM UPDATE</span>
          </div>

          <div className="pt-13">
            <span className="text-5xl block font-bold">Run your club with</span>
            <span className="text-5xl block text-primary font-bold pt-4">clarity.</span>
            <span className="text-xl block pt-10 w-2/3 text-black/90 leading-[2.2rem]">
              The modern management platform designed specifically for football clubs and academies. Organize players, staff, and schedules in one surgical interface.
            </span>
          </div>

          <div className="flex pt-14 gap-7 pb-5">
            <Link href="/register" className="bg-primary text-white font-semibold px-4 py-3 rounded-[0.78rem]">
              Get Started
            </Link>

            <Link href="/" className="px-4 py-3 rounded-[0.78rem] bg-white font-semibold">
              <button>See How It Works</button>
            </Link>
          </div>

          {/* avatar testimonials */}
          <div className="flex pt-12 gap-7 pb-10">
            <div className="flex -space-x-3 items-center">
              {avatarLinks.map((avatar, ndx) => (
                <div 
                  key={ndx} 
                  className="relative h-8 w-8 aspect-square rounded-full border-2 border-white overflow-hidden shrink-0 animate-wave"
                  style={{ 
                    zIndex: avatarLinks.length - ndx,
                    animationDelay: `${ndx * 0.2}s`
                  }}
                >
                  <Image
                    src={avatar} 
                    alt={`Avatar ${ndx}`} fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="text-[1.1rem] text-black/90">Trusted by 500+ modern football clubs</span>
          </div>
        </div>

        {/* Right hero section */}
        <div className="flex-1 right-home-hero-section pr-12 pt-[4.6rem] relative">

          {/* Top left floating card */}
          <div 
            className="absolute -left-30 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-200 flex items-center gap-3 animate-wave"
            style={{ animationDelay: '.3s' }}
          >
            <div>
              <div className="flex items-center gap-3">
                <svg 
                  width={60} 
                  height={60} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className={"text-primary"}
                >
                  {/* Outer Hexagon */}
                  <polygon points="12 2 20.66 7 20.66 17 12 22 3.34 17 3.34 7" />
                  {/* Inner Polygon (Player Stats Fill) */}
                  <polygon points="12 6 18 9 16 15 12 18 6 15 8 9" opacity="0.5" fill="currentColor" />
                  {/* Axis Lines connecting to center */}
                  <line x1="12" y1="12" x2="12" y2="2" />
                  <line x1="12" y1="12" x2="20.66" y2="7" />
                  <line x1="12" y1="12" x2="20.66" y2="17" />
                  <line x1="12" y1="12" x2="12" y2="22" />
                  <line x1="12" y1="12" x2="3.34" y2="17" />
                  <line x1="12" y1="12" x2="3.34" y2="7" />
                </svg>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Player stats</h4>
                  <ul className="text-sm">
                    <li>Goals: 12</li>
                    <li>Assists: 5</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Top Right Floating Card */}
          <div className="absolute top-30 right-32 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-200 flex flex-col items-center gap-3 animate-wave">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Next Match</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-white font-bold text-xs">CS</div>
              <span className="text-xs text-gray-400 font-bold">VS</span>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">MA</div>
            </div>
          </div>

          {/* Main Showcase Image Container */}
          <div className="w-fit shadow-[10px_20px_50px_rgba(0,0,0,0.67)] rounded-2xl translate-y-5 mt-22 hover:scale-125 transition-transform duration-300">
            <Image 
              src="/hero-image.jpeg" 
              alt="Hero Image" 
              width={720} height={720}
              className="rounded-2xl"
            />
          </div>

          {/* Bottom Left Floating Card */}
          <div 
            className="absolute bottom-0 -left-8 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-200 flex items-center gap-3 animate-wave"
            style={{ animationDelay: '.2s' }}
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-5 h-5"/>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900">Squad Availability</h4>
              <p className="text-xs font-semibold text-emerald-600">+12% this month</p>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Marquee Section */}
      <section className="w-full max-w-full min-w-0 overflow-hidden my-10">
        <div className="h-12"/>
        <InfiniteMarquee items={features} />
        <div className="h-12"/>
      </section>

      {/* Chaos-to-Clarity scroll */}
      <section>
        <Chaos2Clarity />
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12 px-6 hidden">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2025 ClubSheet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
