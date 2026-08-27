"use client";

import { useState } from "react";
import {
  BadgeCheck, Briefcase, Group, History, KeyRound,
  ShirtIcon, TrendingUp, User, ChevronDown, Send,
  Users, Shield, Dumbbell, Trophy, GraduationCap,
  Shirt, Banknote, Stethoscope,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import InfiniteMarquee, { FeatureItem } from "../components/home/infiniteMarquee";
import Chaos2ClaritySection from "../components/home/chaos2Clarity.section";

// ── Static data ─────────────────────────────────────────────────────────────

const avatarLinks = [
  "https://images.unsplash.com/photo-1615109398623-88346a601842?ixid=M3w4MjcwNjd8MHwxfHNlYXJjaHwxfHxodW1hbnxlbnwwfHx8fDE3ODc1NzY5NDZ8MA&ixlib=rb-4.1.0&fit=max&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=M3w4MjcwNjd8MHwxfHNlYXJjaHw2fHxodW1hbnxlbnwwfHx8fDE3ODc1NzY5NDZ8MA&ixlib=rb-4.1.0&fit=max&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixid=M3w4MjcwNjd8MHwxfHNlYXJjaHw3fHxodW1hbnxlbnwwfHx8fDE3ODc1NzY5NDZ8MA&ixlib=rb-4.1.0&fit=max&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixid=M3w4MjcwNjd8MHwxfHNlYXJjaHwxMHx8aHVtYW58ZW58MHx8fHwxNzg3NTc2OTQ2fDA&ixlib=rb-4.1.0&fit=max&q=80",
];

const marqueeFeatures: FeatureItem[] = [
  { label: "PLAYERS",  icon: Users },
  { label: "TEAMS",    icon: Shield },
  { label: "TRAINING", icon: Dumbbell },
  { label: "MATCHES",  icon: Trophy },
  { label: "ACADEMY",  icon: GraduationCap },
  { label: "KITS",     icon: Shirt },
  { label: "FINANCE",  icon: Banknote },
  { label: "MEDICAL",  icon: Stethoscope },
];

const starterItems = [
  { label: "Players & Squads",      icon: Users },
  { label: "Teams",                 icon: Shield },
  { label: "Coaches",               icon: Briefcase },
  { label: "Training",              icon: Dumbbell },
  { label: "People & Staff",        icon: User },
  { label: "Memberships",           icon: BadgeCheck },
  { label: "Roles & Permissions",   icon: KeyRound },
  { label: "Activity & History",    icon: History },
];

const perspectives = [
  {
    role: "Admin",
    desc: "Full control. Manage people, finances, documents, and access across the whole club from one dashboard.",
    points: ["Manage all members and roles", "Track finances and documents", "Set permissions for every role", "Overview of the whole club"],
  },
  {
    role: "Coach",
    desc: "Focus on your squad. Training sessions, player availability, and match prep — all in one place.",
    points: ["View and manage your squad", "Plan and track training sessions", "Access player performance data", "Communicate with your team"],
  },
  {
    role: "Player",
    desc: "Know your schedule. Upcoming training, your stats, fixtures, and club news — always up to date.",
    points: ["See your upcoming training", "Check your personal stats", "View fixtures and results", "Receive club announcements"],
  },
  {
    role: "Staff",
    desc: "Stay in the loop. Kit, medical, and operational tasks without the back-and-forth messages.",
    points: ["Manage kit and equipment", "Track medical clearances", "Handle operational tasks", "Coordinate with admin"],
  },
  {
    role: "Guardian",
    desc: "Know your child is in good hands. Stay informed about schedules, communications, and club updates.",
    points: ["See your child's training schedule", "Receive important club updates", "Sign consent forms digitally", "Stay connected with coaches"],
  },
];

const faqs = [
  { q: "Is ClubSheet free to use?",                        a: "The core platform is free to get started. Modules like Finance, Medical, and Academy are add-ons you can plug in as your club grows.", votes: 84 },
  { q: "Do I need technical knowledge to set up my club?", a: "Not at all. ClubSheet is designed for club administrators, not developers. You can have your club running in minutes.",                votes: 61 },
  { q: "Can I manage multiple teams in one club?",         a: "Yes. ClubSheet is built for multi-team organisations. Each team has its own space while everything stays connected at the club level.", votes: 53 },
  { q: "How does access control work?",                    a: "You assign roles — Admin, Coach, Player, Staff, Guardian — and each role sees only what they need. Fine-grained permissions keep sensitive data safe.", votes: 47 },
  { q: "Can players and coaches use ClubSheet on mobile?", a: "Yes. ClubSheet is fully responsive and works on any device. No app download required.",                                               votes: 39 },
  { q: "What happens to my data?",                        a: "Your club data belongs to you. We never sell it or share it with third parties. You can export or delete it at any time.",               votes: 35 },
];

// ── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="bg-quaternary">

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <header className="flex justify-between items-center w-full p-5 gap-5 sticky top-0 z-100 bg-quaternary/90 backdrop-blur-sm border-b border-secondary/50">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-light-clip.jpeg" alt="ClubSheet" width={26} height={20} />
          <span className="text-2xl font-bold ml-1 text-primary">ClubSheet</span>
        </Link>

        <nav className="flex gap-10">
          <Link href="#features"  className="text-zinc-600 hover:text-primary transition-colors text-sm font-medium">Features</Link>
          <Link href="#modules"   className="text-zinc-600 hover:text-primary transition-colors text-sm font-medium">Modules</Link>
          <Link href="#who"       className="text-zinc-600 hover:text-primary transition-colors text-sm font-medium">Who it&apos;s for</Link>
          <Link href="#faq"       className="text-zinc-600 hover:text-primary transition-colors text-sm font-medium">FAQ</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-zinc-600 hover:text-primary transition-colors text-sm font-medium">Sign In</Link>
          <Link
            href="/register"
            className="bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-tertiary hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section id="features" className="flex w-screen">
        <div className="flex-1 pl-13 pt-[4.6rem] left-home-hero-section">
          <div className="inline-flex items-center gap-2 bg-secondary rounded-[.4rem] px-3 py-1.5">
            <div className="h-[.67rem] w-[.67rem] bg-primary rounded-full shrink-0 animate-swell" />
            <span className="font-semibold text-[.7rem] leading-none text-zinc-700">NEW PLATFORM UPDATE</span>
          </div>

          <div className="pt-13">
            <span className="text-5xl block font-bold text-zinc-900">Run your club with</span>
            <span className="text-5xl block text-primary font-bold pt-4">clarity.</span>
            <span className="text-xl block pt-10 w-2/3 text-zinc-700 leading-[2.2rem]">
              The modern management platform for football clubs and academies. Organise players, staff, and schedules in one place.
            </span>
          </div>

          <div className="flex pt-14 gap-4 pb-5">
            <Link
              href="/register"
              className="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-tertiary hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="#features"
              className="px-6 py-3 rounded-xl bg-white border border-secondary font-semibold text-zinc-700 hover:border-primary hover:text-primary hover:-translate-y-0.5 transition-all shadow-sm"
            >
              See How It Works
            </Link>
          </div>

          <div className="flex pt-12 gap-5 pb-10 items-center">
            <div className="flex -space-x-3 items-center">
              {avatarLinks.map((avatar, ndx) => (
                <div
                  key={ndx}
                  className="relative h-8 w-8 rounded-full border-2 border-white overflow-hidden shrink-0 animate-wave"
                  style={{ zIndex: avatarLinks.length - ndx, animationDelay: `${ndx * 0.2}s` }}
                >
                  <Image src={avatar} alt={`Avatar ${ndx}`} fill className="object-cover" />
                </div>
              ))}
            </div>
            <span className="text-base text-zinc-600">Trusted by 500+ modern football clubs</span>
          </div>
        </div>

        <div className="flex-1 right-home-hero-section pr-12 pt-[4.6rem] relative">
          <div
            className="absolute -left-30 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,95,49,0.12)] border border-secondary flex items-center gap-3 animate-wave hover:scale-105 transition-transform cursor-default"
            style={{ animationDelay: ".3s" }}
          >
            <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <polygon points="12 2 20.66 7 20.66 17 12 22 3.34 17 3.34 7" />
              <polygon points="12 6 18 9 16 15 12 18 6 15 8 9" opacity="0.4" fill="currentColor" />
              <line x1="12" y1="12" x2="12" y2="2" /><line x1="12" y1="12" x2="20.66" y2="7" />
              <line x1="12" y1="12" x2="20.66" y2="17" /><line x1="12" y1="12" x2="12" y2="22" />
              <line x1="12" y1="12" x2="3.34" y2="17" /><line x1="12" y1="12" x2="3.34" y2="7" />
            </svg>
            <div>
              <h4 className="text-sm font-bold text-zinc-900">Player stats</h4>
              <p className="text-sm text-zinc-500">Goals: 12 · Assists: 5</p>
            </div>
          </div>

          <div className="absolute top-30 right-32 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,95,49,0.12)] border border-secondary flex flex-col items-center gap-3 animate-wave hover:scale-105 transition-transform cursor-default">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Next Match</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">CS</div>
              <span className="text-xs text-zinc-400 font-bold">VS</span>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-zinc-600 font-bold text-xs">MA</div>
            </div>
          </div>

          <div className="w-fit shadow-[10px_20px_50px_rgba(0,0,0,0.67)] rounded-2xl translate-y-5 mt-22 hover:scale-[1.02] transition-transform duration-300 cursor-default">
            <Image src="/hero-image.jpeg" alt="ClubSheet dashboard" width={720} height={720} className="rounded-2xl" />
          </div>

          <div
            className="absolute bottom-0 -left-8 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,95,49,0.12)] border border-secondary flex items-center gap-3 animate-wave hover:scale-105 transition-transform cursor-default"
            style={{ animationDelay: ".2s" }}
          >
            <div className="w-10 h-10 rounded-full bg-quinary flex items-center justify-center text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900">Squad Availability</h4>
              <p className="text-xs font-semibold text-primary">+12% this month</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ───────────────────────────────────────────────────────── */}
      <section className="w-full max-w-full min-w-0 overflow-hidden my-10">
        <div className="h-12" />
        <InfiniteMarquee items={marqueeFeatures} />
        <div className="h-12" />
      </section>

      {/* ── Chaos → Clarity ───────────────────────────────────────────────── */}
      <section>
        <Chaos2ClaritySection />
      </section>

      {/* ── Starter Kit ───────────────────────────────────────────────────── */}
      <section id="features" className="bg-quinary py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-10">
          <div className="flex flex-col items-center text-center gap-3">
            <h2 className="text-3xl font-bold text-zinc-900">Everything you need to start</h2>
            <p className="text-zinc-500 text-base max-w-lg">Built-in essentials to get your club organised from day one. No extras required.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full sm:grid-cols-4">
            {starterItems.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="bg-white rounded-xl border border-secondary flex flex-col items-center gap-3 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary/40 transition-all cursor-default"
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-zinc-800 text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Build Your Club ───────────────────────────────────────────────── */}
      <section id="modules" className="w-full bg-quaternary py-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-14">
          <div className="text-center flex flex-col gap-3">
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Build the Club You Need</h2>
            <p className="text-zinc-500 text-base max-w-sm mx-auto">Plug in powerful modules as your club grows.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 w-full sm:grid-cols-3">
            {[
              { title: "Football",          items: ["Matches", "Player Development"] },
              { title: "Academy",           items: ["Academy Management"] },
              { title: "Operations & More", items: ["Kit Management", "Finance Management", "Medical Management", "Events & Activities"] },
            ].map((group) => (
              <div
                key={group.title}
                className="bg-quinary rounded-2xl border border-secondary p-7 flex flex-col gap-5 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 transition-all cursor-default"
              >
                <h3 className="text-lg font-bold text-primary">{group.title}</h3>
                <ul className="flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-zinc-700">
                      <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* ── Why Clubs Use It ──────────────────────────────────────────────── */}
      <section className="w-full bg-quinary py-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-14">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
              Spend less time managing.<br />More time running your club.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 w-full sm:grid-cols-3">
            {[
              { title: "One source of truth",     desc: "Everything in one place." },
              { title: "Less administration",      desc: "Automate the boring stuff." },
              { title: "Better visibility",        desc: "See what's happening instantly." },
              { title: "Clearer responsibilities", desc: "Everyone knows their role." },
              { title: "Built to grow",            desc: "Scales with your ambition." },
              { title: "Better club experience",   desc: "Happy staff, happy players." },
            ].map((b) => (
              <div
                key={b.title}
                className="bg-quaternary rounded-2xl border border-secondary p-7 flex flex-col gap-2 hover:shadow-md hover:-translate-y-1 hover:border-primary/30 transition-all cursor-default"
              >
                <h3 className="text-sm font-bold text-zinc-900">{b.title}</h3>
                <p className="text-sm text-zinc-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who uses ClubSheet ────────────────────────────────────────────── */}
      <section id="who" className="w-full bg-quaternary py-24 px-6">
        <WhoSection />
      </section>

      {/* ── Built For ─────────────────────────────────────────────────────── */}
      <section className="w-full bg-quinary py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-10 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Built for clubs like yours.</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["Grassroots Clubs", "Academies", "Youth Clubs", "Competitive Teams", "Multi-team Organisations"].map((t) => (
              <span
                key={t}
                className="bg-white border border-secondary text-zinc-700 text-sm font-medium px-5 py-2.5 rounded-full hover:border-primary hover:text-primary hover:-translate-y-0.5 transition-all cursor-default"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq">
        <FaqSection />
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="w-full bg-primary py-28 px-6">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-8">
          <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">
            Your club is more than spreadsheets.
          </h2>
          <p className="text-white/70 text-lg max-w-md">Get started for free. No credit card required.</p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              href="/register"
              className="bg-white text-primary font-semibold px-8 py-3.5 rounded-xl hover:bg-quinary hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="border border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:border-white hover:bg-white/10 hover:-translate-y-0.5 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-zinc-900 text-zinc-400 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo-dark-clip.jpeg" alt="ClubSheet" width={24} height={18} className="rounded-sm" />
              <span className="text-white font-bold text-base">ClubSheet</span>
            </div>
            <p className="text-sm leading-relaxed">The modern management platform for football clubs and academies.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-sm font-semibold">Product</h4>
            {["Features", "Modules", "Pricing", "Changelog"].map((l) => (
              <Link key={l} href="/" className="text-sm hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-sm font-semibold">Company</h4>
            {["About", "Blog", "Careers", "Contact"].map((l) => (
              <Link key={l} href="/" className="text-sm hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-sm font-semibold">Legal</h4>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <Link key={l} href="/" className="text-sm hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-12 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">&copy; 2025 ClubSheet. All rights reserved.</p>
          <p className="text-sm">Made for clubs that mean business.</p>
        </div>
      </footer>
    </div>
  );
}

// ── Who uses ClubSheet — interactive tab switcher ────────────────────────────

function WhoSection() {
  const [active, setActive] = useState(0);
  const current = perspectives[active];

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center gap-10">
      <div className="text-center flex flex-col gap-3">
        <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Who uses ClubSheet?</h2>
        <p className="text-zinc-500 text-base">Every role gets exactly what they need.</p>
      </div>

      {/* Role tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {perspectives.map((p, i) => (
          <button
            key={p.role}
            onClick={() => setActive(i)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              active === i
                ? "bg-primary text-white shadow-md"
                : "bg-quinary border border-secondary text-zinc-600 hover:border-primary hover:text-primary"
            }`}
          >
            {p.role}
          </button>
        ))}
      </div>

      {/* Active perspective card */}
      <div className="w-full bg-quinary border border-secondary rounded-2xl p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">{current.role}</span>
          <p className="text-zinc-700 text-base leading-relaxed">{current.desc}</p>
        </div>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {current.points.map((pt) => (
            <li key={pt} className="flex items-center gap-2 text-sm text-zinc-600">
              <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {pt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── FAQ — collapsible + vote count + ask your own question modal ────────────

function FaqSection() {
  const [open, setOpen]       = useState<number | null>(null);
  const [votes, setVotes]     = useState<number[]>(faqs.map((f) => f.votes));
  const [voted, setVoted]     = useState<Set<number>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail]     = useState("");
  const [question, setQuestion] = useState("");
  const [sent, setSent]       = useState(false);

  const handleVote = (i: number) => {
    if (voted.has(i)) return;
    setVotes((v) => v.map((c, idx) => (idx === i ? c + 1 : c)));
    setVoted((s) => new Set(s).add(i));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !email.trim()) return;
    window.location.href = `mailto:hello@clubsheet.io?subject=Question from ${encodeURIComponent(email)}&body=${encodeURIComponent(question)}`;
    setSent(true);
    setTimeout(() => {
      setModalOpen(false);
      setSent(false);
      setEmail("");
      setQuestion("");
    }, 2000);
  };

  return (
    <div className="w-full bg-quaternary py-24 px-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-10">
        <div className="text-center flex flex-col gap-3">
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Questions clubs ask</h2>
          <p className="text-zinc-500 text-base">Straight answers. No fluff.</p>
        </div>

        {/* Accordion — vote and expand are separate elements, never nested buttons */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-quinary border border-secondary rounded-2xl overflow-hidden hover:border-primary/40 transition-colors"
            >
              {/* Row: not a button itself — children are the interactive elements */}
              <div className="flex items-center gap-3 px-6 py-5">
                {/* Expand toggle — takes up remaining space */}
                <button
                  className="flex-1 text-left flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="font-semibold text-zinc-900 text-sm flex-1">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-primary shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Vote — separate button, not nested */}
                <button
                  onClick={() => handleVote(i)}
                  title={voted.has(i) ? "Already voted" : "This question helped me too"}
                  className={`flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-full border transition-all shrink-0 ${
                    voted.has(i)
                      ? "bg-quinary border-primary text-primary"
                      : "border-secondary text-zinc-400 hover:border-primary hover:text-primary"
                  }`}
                  aria-label="This question helped me"
                >
                  <svg
                    className="w-3 h-3"
                    fill={voted.has(i) ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  {votes[i]}
                </button>
              </div>

              {open === i && (
                <div className="px-6 pb-5 border-t border-secondary/50">
                  <p className="text-sm text-zinc-600 leading-relaxed pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trigger to open ask modal */}
        <div className="bg-quinary border border-secondary rounded-2xl p-7 flex items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-zinc-900 text-base">Don&apos;t see your question?</h3>
            <p className="text-sm text-zinc-500">Send it to us — we read every message.</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="shrink-0 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-tertiary hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md"
          >
            <Send className="w-4 h-4" />
            Ask a question
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-200 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_2rem_5rem_rgba(0,95,49,0.18)] border border-secondary p-8 flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-zinc-900 text-lg">Ask us anything</h3>
                <p className="text-sm text-zinc-500">We&apos;ll reply to your email directly.</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 transition-colors mt-0.5"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {sent ? (
              <div className="flex items-center gap-2 text-sm text-primary font-medium py-4">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Question sent. We&apos;ll get back to you soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ask-email" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Your email
                  </label>
                  <input
                    id="ask-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourclub.com"
                    className="bg-quaternary border border-secondary rounded-xl px-4 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ask-question" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Your question
                  </label>
                  <textarea
                    id="ask-question"
                    required
                    rows={4}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What would you like to know about ClubSheet?"
                    className="bg-quaternary border border-secondary rounded-xl px-4 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-tertiary hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md"
                >
                  <Send className="w-4 h-4" />
                  Send question
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
