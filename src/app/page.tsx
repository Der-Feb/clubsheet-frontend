
import { Suspense } from "react";
import {
  BadgeCheck, Briefcase, History, KeyRound,
  TrendingUp, User, Users, Shield, Dumbbell,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import InfiniteMarquee from "@/components/home/infiniteMarquee";
import Chaos2ClaritySection from "@/components/home/chaos2Clarity.section";
import { FaqSection, WhoSection } from "@/components/home/home.section";

const avatarLinks = [
  "https://images.unsplash.com/photo-1615109398623-88346a601842?ixid=M3w4MjcwNjd8MHwxfHNlYXJjaHwxfHxodW1hbnxlbnwwfHx8fDE3ODc1NzY5NDZ8MA&ixlib=rb-4.1.0&fit=max&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=M3w4MjcwNjd8MHwxfHNlYXJjaHw2fHxodW1hbnxlbnwwfHx8fDE3ODc1NzY5NDZ8MA&ixlib=rb-4.1.0&fit=max&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixid=M3w4MjcwNjd8MHwxfHNlYXJjaHw3fHxodW1hbnxlbnwwfHx8fDE3ODc1NzY5NDZ8MA&ixlib=rb-4.1.0&fit=max&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixid=M3w4MjcwNjd8MHwxfHNlYXJjaHwxMHx8aHVtYW58ZW58MHx8fHwxNzg3NTc2OTQ2fDA&ixlib=rb-4.1.0&fit=max&q=80",
];

const starterItems = [
  { label: "Athletes & Squads",    icon: Users },
  { label: "Teams",               icon: Shield },
  { label: "Coaches",             icon: Briefcase },
  { label: "Training",            icon: Dumbbell },
  { label: "People & Staff",      icon: User },
  { label: "Memberships",         icon: BadgeCheck },
  { label: "Roles & Permissions", icon: KeyRound },
  { label: "Activity & History",  icon: History },
];

export default function Home() {
  return (
    <div className="bg-quaternary">

      {/* Navbar */}
      <header className="flex justify-between items-center w-full px-6 py-4 sticky top-0 z-100 bg-quaternary/90 backdrop-blur-sm border-b border-secondary/50">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-light-clip.jpeg" alt="ClubSheet" width={22} height={16} />
          <span className="text-base font-bold ml-1 text-primary">ClubSheet</span>
        </Link>

        <nav className="flex gap-8">
          <Link href="#features" className="text-zinc-600 hover:text-primary transition-colors text-xs font-medium">Features</Link>
          <Link href="#modules"  className="text-zinc-600 hover:text-primary transition-colors text-xs font-medium">Modules</Link>
          <Link href="#who"      className="text-zinc-600 hover:text-primary transition-colors text-xs font-medium">Who it&apos;s for</Link>
          <Link href="#faq"      className="text-zinc-600 hover:text-primary transition-colors text-xs font-medium">FAQ</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-zinc-600 hover:text-primary transition-colors text-xs font-medium">Sign In</Link>
          <Link
            href="/register"
            className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-tertiary hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section id="features" className="flex w-screen">
        <div className="flex-1 pl-13 pt-[4.6rem] left-home-hero-section">
          <div className="inline-flex items-center gap-2 bg-secondary rounded-[.4rem] px-3 py-1.5">
            <div className="h-[.6rem] w-[.6rem] bg-primary rounded-full shrink-0 animate-swell" />
            <span className="font-semibold text-[.65rem] leading-none text-zinc-700">NEW PLATFORM UPDATE</span>
          </div>

          <div className="pt-10">
            <span className="text-3xl block font-bold text-zinc-900">Run your club with</span>
            <span className="text-3xl block text-primary font-bold pt-3">clarity.</span>
            <span className="text-sm block pt-8 w-2/3 text-zinc-700 leading-relaxed">
              The modern management platform for football clubs and academies. Organise athletes, staff, and schedules in one place.
            </span>
          </div>

          <div className="flex pt-10 gap-3 pb-4">
            <Link
              href="/register"
              className="bg-primary text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-tertiary hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="#features"
              className="px-5 py-2.5 rounded-xl bg-white border border-secondary text-xs font-semibold text-zinc-700 hover:border-primary hover:text-primary hover:-translate-y-0.5 transition-all shadow-sm"
            >
              See How It Works
            </Link>
          </div>

          <div className="flex pt-8 gap-4 pb-8 items-center">
            <div className="flex -space-x-3 items-center">
              {avatarLinks.map((avatar, ndx) => (
                <div
                  key={ndx}
                  className="relative h-7 w-7 rounded-full border-2 border-white overflow-hidden shrink-0 animate-wave"
                  style={{ zIndex: avatarLinks.length - ndx, animationDelay: `${ndx * 0.2}s` }}
                >
                  <Image src={avatar} alt={`Avatar ${ndx}`} fill className="object-cover" />
                </div>
              ))}
            </div>
            <span className="text-xs text-zinc-600">Trusted by 500+ modern football clubs</span>
          </div>
        </div>

        <div className="flex-1 right-home-hero-section pr-12 pt-[4.6rem] relative">
          <div
            className="absolute -left-30 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,95,49,0.12)] border border-secondary flex items-center gap-3 animate-wave hover:scale-105 transition-transform cursor-default"
            style={{ animationDelay: ".3s" }}
          >
            <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <polygon points="12 2 20.66 7 20.66 17 12 22 3.34 17 3.34 7" />
              <polygon points="12 6 18 9 16 15 12 18 6 15 8 9" opacity="0.4" fill="currentColor" />
              <line x1="12" y1="12" x2="12" y2="2" /><line x1="12" y1="12" x2="20.66" y2="7" />
              <line x1="12" y1="12" x2="20.66" y2="17" /><line x1="12" y1="12" x2="12" y2="22" />
              <line x1="12" y1="12" x2="3.34" y2="17" /><line x1="12" y1="12" x2="3.34" y2="7" />
            </svg>
            <div>
              <h4 className="text-xs font-bold text-zinc-900">Athlete stats</h4>
              <p className="text-xs text-zinc-500">Goals: 12 · Assists: 5</p>
            </div>
          </div>

          <div className="absolute top-30 right-32 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,95,49,0.12)] border border-secondary flex flex-col items-center gap-2 animate-wave hover:scale-105 transition-transform cursor-default">
            <span className="text-[0.6rem] font-semibold text-zinc-500 uppercase tracking-wider">Next Match</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[0.6rem]">CS</div>
              <span className="text-[0.6rem] text-zinc-400 font-bold">VS</span>
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-zinc-600 font-bold text-[0.6rem]">MA</div>
            </div>
          </div>

          <div className="w-fit shadow-[10px_20px_50px_rgba(0,0,0,0.67)] rounded-2xl translate-y-5 mt-22 hover:scale-[1.02] transition-transform duration-300 cursor-default">
            <Image src="/hero-image.jpeg" alt="ClubSheet dashboard" width={720} height={720} className="rounded-2xl" />
          </div>

          <div
            className="absolute bottom-0 -left-8 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,95,49,0.12)] border border-secondary flex items-center gap-3 animate-wave hover:scale-105 transition-transform cursor-default"
            style={{ animationDelay: ".2s" }}
          >
            <div className="w-8 h-8 rounded-full bg-quinary flex items-center justify-center text-primary">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900">Squad Availability</h4>
              <p className="text-[0.65rem] font-semibold text-primary">+12% this month</p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="w-full max-w-full min-w-0 overflow-hidden my-8">
        <div className="h-10" />
        <InfiniteMarquee />
        <div className="h-10" />
      </section>

      {/* Chaos → Clarity */}
      <section>
        <Chaos2ClaritySection />
      </section>

      {/* Starter Kit */}
      <section id="features" className="bg-quinary py-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-8">
          <div className="flex flex-col items-center text-center gap-2">
            <h2 className="text-xl font-bold text-zinc-900">Everything you need to start</h2>
            <p className="text-zinc-500 text-xs max-w-lg">Built-in essentials to get your club organised from day one. No extras required.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full sm:grid-cols-4">
            {starterItems.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="bg-white rounded-xl border border-secondary flex flex-col items-center gap-2.5 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary/40 transition-all cursor-default"
              >
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-zinc-800 text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Build Your Club */}
      <section id="modules" className="w-full bg-quaternary py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
          <div className="text-center flex flex-col gap-2">
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Build the Club You Need</h2>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto">Plug in powerful modules as your club grows.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 w-full sm:grid-cols-3">
            {[
              { title: "Football",          items: ["Matches", "Athlete Development"] },
              { title: "Academy",           items: ["Academy Management"] },
              { title: "Operations & More", items: ["Kit Management", "Finance Management", "Medical Management", "Events & Activities"] },
            ].map((group) => (
              <div
                key={group.title}
                className="bg-quinary rounded-2xl border border-secondary p-6 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 transition-all cursor-default"
              >
                <h3 className="text-sm font-bold text-primary">{group.title}</h3>
                <ul className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-zinc-700">
                      <svg className="w-3 h-3 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Clubs Use It */}
      <section className="w-full bg-quinary py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
          <div className="text-center">
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight leading-snug">
              Spend less time managing.<br />More time running your club.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 w-full sm:grid-cols-3">
            {[
              { title: "One source of truth",     desc: "Everything in one place." },
              { title: "Less administration",      desc: "Automate the boring stuff." },
              { title: "Better visibility",        desc: "See what's happening instantly." },
              { title: "Clearer responsibilities", desc: "Everyone knows their role." },
              { title: "Built to grow",            desc: "Scales with your ambition." },
              { title: "Better club experience",   desc: "Happy staff, happy athletes." },
            ].map((b) => (
              <div
                key={b.title}
                className="bg-quaternary rounded-2xl border border-secondary p-6 flex flex-col gap-1.5 hover:shadow-md hover:-translate-y-1 hover:border-primary/30 transition-all cursor-default"
              >
                <h3 className="text-xs font-bold text-zinc-900">{b.title}</h3>
                <p className="text-xs text-zinc-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who uses ClubSheet */}
      <section id="who" className="w-full bg-quaternary py-20 px-6">
        <WhoSection />
      </section>

      {/* Built For */}
      <section className="w-full bg-quinary py-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-8 text-center">
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Built for clubs like yours.</h2>
          <div className="flex flex-wrap justify-center gap-2.5">
            {["Grassroots Clubs", "Academies", "Youth Clubs", "Competitive Teams", "Multi-team Organisations"].map((t) => (
              <span
                key={t}
                className="bg-white border border-secondary text-zinc-700 text-xs font-medium px-4 py-2 rounded-full hover:border-primary hover:text-primary hover:-translate-y-0.5 transition-all cursor-default"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <Suspense>
          <FaqSection />
        </Suspense>
      </section>

      {/* CTA */}
      <section className="w-full bg-primary py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center gap-5">
          <span className="text-white/60 text-[0.6rem] font-mono uppercase tracking-widest">Get started today</span>
          <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">
            Your club is more<br />than spreadsheets.
          </h2>
          <p className="text-white/65 text-xs max-w-sm leading-relaxed">
            One platform. Every athlete, coach, and admin — organised and connected from day one.
          </p>
          <div className="flex gap-3 flex-wrap justify-center pt-1">
            <Link
              href="/register"
              className="bg-white text-primary font-semibold text-xs px-6 py-2.5 rounded-xl hover:bg-quinary hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="border border-white/30 text-white font-semibold text-xs px-6 py-2.5 rounded-xl hover:border-white/70 hover:bg-white/10 hover:-translate-y-0.5 transition-all"
            >
              Sign In
            </Link>
          </div>
          <p className="text-white/40 text-[0.6rem]">No credit card required · Free forever on core plan</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-500 pt-14 pb-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-5 pb-10 border-b border-zinc-800">

            <div className="col-span-2 sm:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Image src="/logo-dark-clip.jpeg" alt="ClubSheet" width={20} height={15} className="rounded-sm opacity-90" />
                <span className="text-white font-bold text-xs tracking-tight">ClubSheet</span>
              </div>
              <p className="text-[0.65rem] leading-relaxed max-w-68">
                The modern management platform for football clubs and academies. Athletes, coaches, training, finances — all in one place.
              </p>
              <div className="flex gap-2.5">
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className="h-7 w-7 rounded-lg bg-zinc-800 flex-center hover:bg-zinc-700 transition-colors">
                  <svg className="w-3 h-3 text-zinc-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="h-7 w-7 rounded-lg bg-zinc-800 flex-center hover:bg-zinc-700 transition-colors">
                  <svg className="w-3 h-3 text-zinc-400" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <h4 className="text-zinc-300 text-[0.6rem] font-semibold uppercase tracking-wider">Product</h4>
              {["Features", "Modules", "Pricing", "Changelog"].map((l) => (
                <Link key={l} href="/" className="text-[0.65rem] hover:text-zinc-200 transition-colors">{l}</Link>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              <h4 className="text-zinc-300 text-[0.6rem] font-semibold uppercase tracking-wider">Company</h4>
              {["About", "Blog", "Careers", "Contact"].map((l) => (
                <Link key={l} href="/" className="text-[0.65rem] hover:text-zinc-200 transition-colors">{l}</Link>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              <h4 className="text-zinc-300 text-[0.6rem] font-semibold uppercase tracking-wider">Legal</h4>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
                <Link key={l} href="/" className="text-[0.65rem] hover:text-zinc-200 transition-colors">{l}</Link>
              ))}
            </div>
          </div>

          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[0.6rem]">&copy; 2025 ClubSheet. All rights reserved.</p>
            <p className="text-[0.6rem]">Made for clubs that mean business.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
