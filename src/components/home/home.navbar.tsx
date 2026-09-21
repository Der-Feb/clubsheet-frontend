'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function HomeNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-100 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-secondary/50 bg-quaternary/90 px-4 backdrop-blur-sm transition-[padding] duration-200 sm:px-6 lg:flex-nowrap lg:py-4 ${isScrolled ? 'py-2' : 'py-3'}`}>
      <Link href="/" className={`flex shrink-0 items-center gap-2 overflow-hidden transition-[max-height,max-width,opacity] duration-300 ease-out md:opacity-100 ${isScrolled ? 'max-md:max-h-0 max-md:max-w-0 max-md:opacity-0 max-md:pointer-events-none' : 'max-md:max-h-8 max-md:max-w-[12rem]'}`}>
        <Image src="/images/logo-light-clip.jpeg" alt="ClubSheet" width={22} height={16} style={{ objectFit: 'contain' }} />
        <span className="ml-1 text-base font-bold text-primary">ClubSheet</span>
      </Link>
      <nav aria-label="Homepage sections" className={`home-nav-scroll order-3 flex w-full max-w-full items-center gap-1 overflow-x-auto border-t border-secondary/60 transition-[padding,border-color] duration-300 ease-out lg:order-none lg:w-auto lg:gap-8 lg:overflow-visible lg:border-t-0 lg:pt-0 ${isScrolled ? 'max-md:border-transparent max-md:pt-0' : 'pt-2'}`}>
        <Link href="#features" className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-white/70 hover:text-primary lg:px-0 lg:py-0 lg:hover:bg-transparent">Features</Link>
        <Link href="#modules" className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-white/70 hover:text-primary lg:px-0 lg:py-0 lg:hover:bg-transparent">Modules</Link>
        <Link href="#who" className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-white/70 hover:text-primary lg:px-0 lg:py-0 lg:hover:bg-transparent">Who it&apos;s for</Link>
        <Link href="#faq" className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-white/70 lg:px-0 lg:py-0 lg:hover:bg-transparent">FAQ</Link>
      </nav>
      <div className={`ml-auto flex max-w-full flex-wrap items-center justify-end gap-2 overflow-hidden transition-[max-height,max-width,opacity] duration-300 ease-out sm:gap-3 md:opacity-100 ${isScrolled ? 'max-md:max-h-0 max-md:max-w-0 max-md:opacity-0 max-md:pointer-events-none' : 'max-md:max-h-10 max-md:max-w-[12rem]'}`}>
        <Link href="/login" className="text-xs font-medium text-zinc-600 transition-colors hover:text-primary">Sign In</Link>
        <Link href="/register" className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-tertiary hover:shadow-md">Get Started</Link>
      </div>
    </header>
  );
}
